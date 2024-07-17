mapboxgl.accessToken = 'pk.eyJ1IjoiY2xhaXJpY2UtbWFwcyIsImEiOiJjbHh2NTY4aTYwbnhxMmtwajlvY2dicHN2In0.KRRnfIcCAsQoPZvbrUrpvg';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard',
    center: [-114.3718, 62.4540],
    zoom: 4
});

map.on('load', () => {
    // Add sources and layers
    const layers = [
        { id: 'clairice-maps.6lmh67ua', label: 'Relational', color: 'rgba(25,165,71,1)', source: 'RelationalGovernancewithNatio-9dqyuo', url: 'mapbox://clairice-maps.6lmh67ua' },
        { id: 'clairice-maps.2rl9k6bz', label: 'Federal', color: 'rgba(116,82,57,1)', source: 'Federalrelational-268mnk', url: 'mapbox://clairice-maps.2rl9k6bz' },
        { id: 'clairice-maps.chrodc9z', label: 'Provincial On-Reserve', color: 'rgba(255,144,67,1)', source: 'ProvincialOn-2znvgn', url: 'mapbox://clairice-maps.chrodc9z' },
        { id: 'clairice-maps.39oeelt2', label: 'Provincial Off-Reserve', color: 'rgba(232,137,232,1)', source: 'ProvincialOFF-7evmmd', url: 'mapbox://clairice-maps.39oeelt2' },
        { id: 'clairice-maps.ayt4xk1v', label: 'Sole Delivery', color: 'rgba(241,59,60,1)', source: 'SoleDelivery-ce00bz', url: 'mapbox://clairice-maps.ayt4xk1v' },
        { id: 'clairice-maps.1vlrlb44', label: 'Sole Delivery Mixed', color: 'rgba(70,93,205,1)', source: 'Sole_Delivery_MIxed-0f5zdi', url: 'mapbox://clairice-maps.1vlrlb44' }
    ];

    layers.forEach(layer => {
        map.addSource(layer.source, {
            type: 'vector',
            url: layer.url
        });
        map.addLayer({
            'id': layer.id,
            'type': 'circle',
            'source': layer.source,
            'layout': {
                'visibility': 'visible'
            },
            'paint': {
                'circle-radius': 8,
                'circle-color': layer.color
            },
            'source-layer': layer.source // Use the same identifier here
        });
        // Add label layer
        map.addLayer({
            'id': layer.id + '-label',
            'type': 'symbol',
            'source': layer.source,
            'layout': {
                'text-field': ['get', 'label'], // Assumes 'name' is the property with the label text
                'text-size': 12
            },
            'paint': {
                'text-color': '#000000'
            },
            'source-layer': layer.source // Use the same identifier here
        });
    });

    const legend = document.getElementById('legend');
    layers.forEach(layer => {
        const item = document.createElement('div');
        item.className = 'legend-item';

        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = layer.color;

        const label = document.createElement('span');
        label.textContent = layer.label;

        item.appendChild(colorBox);
        item.appendChild(label);
        legend.appendChild(item);
    });

    map.on('idle', () => {
        if (layers.some(layer => !map.getLayer(layer.id))) {
            return;
        }

        layers.forEach(layer => {
            if (document.getElementById(layer.id)) return;

            const link = document.createElement('a');
            link.id = layer.id;
            link.href = '#';
            link.textContent = layer.label; // Use custom label here
            link.className = 'active';

            link.onclick = function (e) {
                const clickedLayer = this.id; // Use ID instead of text content
                e.preventDefault();
                e.stopPropagation();

                const visibility = map.getLayoutProperty(clickedLayer, 'visibility');

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                    map.setLayoutProperty(clickedLayer + '-label', 'visibility', 'none');
                    this.className = '';
                } else {
                    this.className = 'active';
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                    map.setLayoutProperty(clickedLayer + '-label', 'visibility', 'visible');
                }
            };

            document.getElementById('menu').appendChild(link);
        });
    });
});
