async function fetchOffers() {
    try {
        const response = await fetch("https://api-offers.vercel.app/api/offers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        });
        const result = await response.json();
        return result.full || [];
    } catch (error) {
        console.error("Błąd pobierania danych:", error);
        return [];
    }
}

function renderOffers(offers) {
    const container = document.getElementById("offers-container");
    container.innerHTML = "";

    if (offers.length === 0) {
        container.innerHTML = "<p>Brak ofert do wyświetlenia.</p>";
        return;
    }

    offers.slice(0, 8).forEach(offer => {
        const d = offer.data || {};
        const div = document.createElement("div");
        div.className = "offer-item";
        div.innerHTML = `
            <h3>${d.id_make || "?"} ${d.id_model || ""}</h3>
            <p>${d.yearproduction || ""} • ${d.mileage || ""} km</p>
            <p>Cena: ${d.price || "?"} PLN</p>
        `;
        if (offer.id) {
            div.onclick = () => {
                window.open(`https://oferta.amer-pol.com/oferta/${offer.id}`, "_blank");
            };
        }
        container.appendChild(div);
    });
}

function populateFilters(offers) {
    const brandSelect = document.getElementById("brand");
    const modelSelect = document.getElementById("model");

    const brands = [...new Set(offers.map(o => o.data?.id_make).filter(Boolean))].sort();
    brands.forEach(brand => {
        const opt = document.createElement("option");
        opt.value = brand;
        opt.textContent = brand;
        brandSelect.appendChild(opt);
    });

    brandSelect.onchange = () => {
        const selectedBrand = brandSelect.value;
        modelSelect.innerHTML = '<option value="">Wybierz model</option>';
        const models = [...new Set(
            offers.filter(o => o.data?.id_make === selectedBrand).map(o => o.data?.id_model).filter(Boolean)
        )].sort();
        models.forEach(model => {
            const opt = document.createElement("option");
            opt.value = model;
            opt.textContent = model;
            modelSelect.appendChild(opt);
        });
    };
}

function applyFilters(offers) {
    const brand = document.getElementById("brand").value;
    const model = document.getElementById("model").value;

    return offers.filter(o => {
        const d = o.data || {};
        return (!brand || d.id_make === brand) && (!model || d.id_model === model);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    const offers = await fetchOffers();

    populateFilters(offers);
    renderOffers(offers);

    document.getElementById("filter-button").addEventListener("click", () => {
        const filtered = applyFilters(offers);
        renderOffers(filtered);
    });
});
