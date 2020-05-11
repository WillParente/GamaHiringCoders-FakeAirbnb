var data;

function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
}

var ul = document.getElementById('pagination');
ul.onclick = function (event) {
    var target = getEventTarget(event);
    setPageNumber(target.innerHTML);
};

function setPageNumber(pageNumber) {
    if (!pageNumber || pageNumber < 1) {
        pageNumber = 1;
    }
    renderCards(data, pageNumber);
}

function deleteChild(elementID) {
    var e = document.getElementById(elementID);
    var child = e.lastElementChild;
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    }
}

function renderPage(pageNumber) {
    const api_url = "https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72";
    fetch(api_url)
        .then(response => response.text())
        .then(result => {
            data = JSON.parse(result);
            data = addElements(data);
            data = filterLocation(data);
            data = pagination(data);
            data = totalCost(data);
            if (!pageNumber) {
                renderCards(data, 1);
            } else {
                renderCards(data, pageNumber);
            }

        });
}

function addElements(data) {
    for (let i = 0; i < data.length; i++) {
        data[i]['id'] = i;
        let country;
        let city;
        if (i % 3 == 0) {
            country = 'Brazil';
            city = 'São Paulo';
        }
        else if (i % 3 == 1) {
            country = 'Estados Unidos';
            city = 'Nova York';
        }
        else {
            country = 'Canada'
            city = 'Toronto';
        }

        data[i]['latitude'] = -23.6480311;
        data[i]['longitude'] = -46.6380964, 16;
        data[i]['country'] = country;
        data[i]['city'] = city;
    }
    return data;
}


function totalCost(data) {
    let startDate = new Date(document.getElementById("startDate").value);
    let endDate = new Date(document.getElementById("endDate").value);
    if (startDate && endDate) {
        if (endDate <= startDate) {
            alert("Data fim deve ser maior que data inicio");
        } else {
            const Difference_In_Time = Math.abs(endDate - startDate);
            const Difference_In_Days = Math.ceil(Difference_In_Time / (1000 * 3600 * 24));
            for (let i = 0; i < data.length; i++) {
                data[i]['totalPrice'] = data[i].price * Difference_In_Days;
            }
        }
    }
    return data;
}

function filterLocation(data) {
    const locationFilter = document.getElementById("location").value;
    var filtered;
    if (!locationFilter) {
        filtered = data;
    }
    else {
        filtered = data.filter(function (property) {
            return property.city === locationFilter;
        });
    }
    return filtered;
}

function pagination(data) {
    deleteChild("pagination");
    const totalItensPerPage = 9;
    const totalPages = Math.floor(data.length / totalItensPerPage) + 1
    for (let i = 0; i < data.length; i++) {
        data[i]['page'] = Math.floor((i / totalItensPerPage) + 1);
    }
    for (let j = 0; j < totalPages; j++) {
        ul = document.getElementById("pagination");
        li = document.createElement("li");
        li.className = "page-item";
        a = document.createElement("a");
        a.className = "page-link";
        a.href = "#";
        a.innerHTML = (j + 1);
        ul.appendChild(li);
        li.appendChild(a);
    }
    return data;
}

function renderCards(data, pageNumber) {
    deleteChild("row");
    data.map(propety => {
        const { photo, property_type, name, price, id, latitude, longitude, country, city, page, totalPrice } = propety;
        if (page == pageNumber) {
            //
            row = document.getElementById("row");
            //    
            div = document.createElement("div");
            div.className = "col-md-4";
            //
            card = document.createElement("div");
            card.className = "card mb-4 box-shadow";
            //
            image = document.createElement("IMG");
            image.setAttribute("src", photo);
            image.className = "card-img-top";
            //
            cardBody = document.createElement("div");
            cardBody.className = "card-body";
            //
            cardText = document.createElement("div");
            cardText.className = "card-text";
            //
            propertyType = document.createElement("p");
            propertyType.className = "property-type";
            propertyType.innerHTML = property_type;
            //
            propertyLocation = document.createElement("p");
            propertyLocation.className = "property-location";
            propertyLocation.innerHTML = `${city} - ${country}`;
            //
            propertyName = document.createElement("p");
            propertyName.className = "property-name";
            propertyName.innerHTML = name;
            //
            propertyPrice = document.createElement("p");
            propertyPrice.className = "property-price";
            if (!totalPrice) {
                propertyPrice.innerHTML = `Diária: R$: ${price},00`;
            } else {
                propertyPrice.innerHTML = `Diária: R$: ${price},00 - Total: R$: ${totalPrice},00`;
            }
            //
            row.appendChild(div);
            div.appendChild(card);
            card.appendChild(image);
            card.appendChild(cardBody);
            cardBody.appendChild(cardText);
            cardText.appendChild(propertyType);
            cardText.appendChild(propertyLocation);
            cardText.appendChild(propertyName);
            cardText.appendChild(propertyPrice);
        }
    })
}