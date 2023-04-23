<script defer>
    import { section } from "../store.js"
    import * as THREE from 'three';
    // TODO: generalize to have this extend a platonic solid gallery component
    export let platonicSolid = "dodecahedron"
    export let filename = "./assets/dodecahedron.json";
    export let scrollY = 0;

    let numberOfSides = getNumberOfSides(platonicSolid)
    let drawn = false;
    let initiated = false;
    let canvas;
    let scene;
    let camera;
    let mesh;
    let renderer;
    let angles;
    let title;
    let description;
    let year;
    let awards;
    let tags;
    let gallery;
    let edges;
    let prevIndex = 0;
    let index = 0;

function equals( v1, v2, epsilon = Number.EPSILON ) {
    return ( ( Math.abs( v1.x - v2.x ) < epsilon ) && ( Math.abs( v1.y - v2.y ) < epsilon ) && ( Math.abs( v1.z - v2.z ) < epsilon ) );
}

function getNumberOfSides(platonicSolid) {
    switch (platonicSolid) {
        case "tetrahedron":
            return 4;
        case "cube":
            return 6;
        case "octahedron":
            return 8;
        case "dodecahedron":
            return 12;
        case "icosahedron":
            return 20;
        default:
            return 4;
    }
}

function getGeometry(platonicSolid) {
    switch (platonicSolid) {
        case "tetrahedron":
            return new THREE.TetrahedronGeometry(5);
        case "cube":
            return new THREE.BoxGeometry(5, 5, 5);
        case "octahedron":
            return new THREE.OctahedronGeometry(5);
        case "dodecahedron":
            return new THREE.DodecahedronGeometry(5);
        case "icosahedron":
            return new THREE.IcosahedronGeometry(5);
        default:
            return new THREE.TetrahedronGeometry(5, 0);
    }
}

function getFaceMidpoints() {
    const t = ( 1 + Math.sqrt( 5 ) ) / 2; // 1.618
    const r = 1 / t; // .618

    const dodecaVertices = [

        // (±1, ±1, ±1)
        [- 1, - 1, - 1],    // 0
        [- 1, - 1, 1],      // 1
        [- 1, 1, - 1],      // 2
        [- 1, 1, 1],        // 3
        [1, - 1, - 1],      // 4
        [1, - 1, 1],        // 5
        [1, 1, - 1],        // 6
        [1, 1, 1],          // 7

        // (0, ±1/φ, ±φ)
        [0, - r, - t],      // 8
        [0, - r, t],        // 9
        [0, r, - t],        // 10
        [0, r, t],          // 11

        // (±1/φ, ±φ, 0)
        [- r, - t, 0],      // 12
        [- r, t, 0],        // 13
        [r, - t, 0],        // 14
        [r, t, 0],          // 15

        // (±φ, 0, ±1/φ)
        [- t, 0, - r],      // 16
        [t, 0, - r],        // 17
        [- t, 0, r],        // 18
        [t, 0, r]           // 19
    ];

    const dodecaFaces = [
        [7, 19, 17, 6, 15],
        [19, 5, 14, 4, 17],
        [17, 4, 8, 10, 6],
        [6, 10, 2, 13, 15],
        [3, 11, 7, 15, 13],
        [11, 9, 5, 19, 7],
        [18, 1, 9, 11, 3],
        [8, 0, 16, 2, 10],
        [2, 16, 18, 3, 13],
        [0, 12, 1, 18, 16],
        [4, 14, 12, 0, 8],
        [1, 12, 14, 5, 9]
    ];

    const faceMidpoints = []
    for (var i = 0; i < dodecaFaces.length; i++) {
        const faceVertices = dodecaFaces[i]
        const faceMidpoint = [0,0,0]
        for (var j = faceVertices.length - 1; j >= 0; j--) {
            const faceVertex = faceVertices[j]
            const dodecaVertex = dodecaVertices[faceVertex]

            faceMidpoint[0] += dodecaVertex[0]
            faceMidpoint[1] += dodecaVertex[1]
            faceMidpoint[2] += dodecaVertex[2]
        }
        faceMidpoint[0] =  faceMidpoint[0] / 5;
        faceMidpoint[1] =  faceMidpoint[1] / 5;
        faceMidpoint[2] =  faceMidpoint[2] / 5;
        faceMidpoints.push(new THREE.Vector3(faceMidpoint[0], faceMidpoint[1], faceMidpoint[2]));
    }
    return faceMidpoints
}

let data = [{
    "title": "<b>Puerto Rico:</b> Migration",
    "description": "A pre-pandemic breakdown of Puerto Ricans in the diaspora who were returning to the island",
    "year": "2021",
    "awards": ["Award 1", "Award 2"],
    "tags": ["d3", "Puerto Rico", "Census", "choropleth", "small multiples"]
  },
  {
    "title": "<b>NBA:</b> Recordigami",
    "description": "Pioneering wins and losses through the history of the NBA’s regular season",
    "year": "2022",
    "awards": ["Pudding Cup Honorary Mention"],
    "tags": ["d3", "basketball", "triangle"]
  },
  {
    "title": "Side 3",
    "description": "Description of Side 3",
    "year": "2023",
    "awards": [],
    "tags": ["Tag 3", "Tag 4", "Tag 5"]
  },
  {
    "title": "Side 4",
    "description": "Description of Side 4",
    "year": "2021",
    "awards": ["Award 3"],
    "tags": ["Tag 4", "Tag 5", "Tag 6"]
  },
  {
    "title": "Side 5",
    "description": "Description of Side 5",
    "year": "2022",
    "awards": ["Award 1", "Award 2", "Award 3"],
    "tags": ["Tag 5", "Tag 6", "Tag 7"]
  },
  {
    "title": "Side 6",
    "description": "Description of Side 6",
    "year": "2023",
    "awards": [],
    "tags": ["Tag 6", "Tag 7", "Tag 8"]
  },
  {
    "title": "Side 7",
    "description": "Description of Side 7",
    "year": "2021",
    "awards": ["Award 2", "Award 3"],
    "tags": ["Tag 7", "Tag 8", "Tag 9"]
  },
  {
    "title": "Side 8",
    "description": "Description of Side 8",
    "year": "2022",
    "awards": ["Award 1"],
    "tags": ["Tag 8", "Tag 9", "Tag 10"]
  },
  {
    "title": "Side 9",
    "description": "Description of Side 9",
    "year": "2023",
    "awards": [],
    "tags": ["Tag 9", "Tag 10", "Tag 11"]
  },
  {
    "title": "Side 10",
    "description": "Description of Side 10",
    "year": "2021",
    "awards": ["Award 3"],
    "tags": ["Tag 10", "Tag 11", "Tag 12"]
  },
  {
    "title": "Side 11",
    "description": "Description of Side 11",
    "year": "2022",
    "awards": ["Award 1", "Award 2"],
    "tags": ["Tag 11", "Tag 12", "Tag 13"]
  },
  {
    "title": "Side 12",
    "description": "Description of Side 12",
    "year": "2023",
    "awards": [],
    "tags": ["Tag 12", "Tag 13", "Tag 14"]
  }
]

title = data[0].title;
description = data[0].description;
year = data[0].year;
awards = data[0].awards.join(", ");
tags = data[0].tags.join(", ");

function drawPlatonicSolid(platonicSolid) {
    // TODO: figure out how to get gallery height non-circularly
    const width = .8 * Math.min(window.innerHeight, window.innerHeight); // window.innerWidth / 2;
    const height =  .8 * Math.min(window.innerHeight, window.innerHeight); 
    const dimension = Math.max(width, height);
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, dimension / dimension, 2, 100);
    camera.position.setFromSpherical(new THREE.Spherical().setFromVector3(new THREE.Vector3(0, 0, 15))); 
    camera.lookAt(0,0,0)

    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        gammaOutput: true
    });
    renderer.setPixelRatio(pixelRatio)
    renderer.setSize(dimension, dimension);
    // renderer.setClearColor( 0xffffff, 0 );
    renderer.setClearColor( 0xf6f5f1);
    renderer.render(scene, camera);

    const color = 0xf6f5f1 // 0xFFFFFF;
    const intensity = 1;
    const ambientLight = new THREE.AmbientLight(color, intensity);
    var light = new THREE.HemisphereLight(0x404040, 0xf6f5f1, 0.1);
    // var light = new THREE.HemisphereLight(0x404040, 0xFFFFFF, 0.95);

    const fogColor = 0xf6f5f1 // 0xFFFFFF;  // white
    const near = 7;
    const far = 15;
    scene.fog = new THREE.Fog(fogColor, near, far);

    scene.add(light);
    scene.add(ambientLight);

    const geometry = getGeometry(platonicSolid);

    angles = [
        {x: 0.57, y: -1.57, z: 0}, // manually modified
        {x: -0.57, y: -1.57, z: 0}, // manually modified
        {x: 0, y: -2.5880182946927484, z: 0}, // 3 to 4 flip
        {x: 2.1243706856919418, y: 0, z: 0}, // 4
        {x: 1.0172219678978514, y: 0, z: 0},
        {x: 0, y: -0.5535743588970451, z: 0},
        {x: 0, y: 0.5535743588970451, z: 0},
        {x: 0.57, y: 1.57, z: 0}, // manually modified
        {x: 0, y: 2.5880182946927484, z: 0}, // 9 to 10 flip
        {x: -2.1243706856919418, y: 0, z: 0}, // 10
        {x: -1.0172219678978514, y: 0, z: 0},
        {x: -0.57, y: 1.57, z: 0} // manually modified
    ]

    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: 0x222222, linewidth: 2});
    edges = new THREE.LineSegments(edgesGeometry, material);
    scene.add(edges);

    // const materials = [
    //     new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'assets/textures/test.png' ), side: THREE.DoubleSide } ), // front
    //     new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'assets/textures/test2.png' ), side: THREE.DoubleSide } ), // back
    //     new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'assets/textures/test.png' ), side: THREE.DoubleSide } ), // front
    //     new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'assets/textures/test2.png' ), side: THREE.DoubleSide } ), // back
    //     new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'assets/textures/test.png' ), side: THREE.DoubleSide } ), // front
    //     new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'assets/textures/test2.png' ), side: THREE.DoubleSide } ), // back
    //     new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'assets/textures/test.png' ), side: THREE.DoubleSide } ), // front
    //     new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'assets/textures/test2.png' ), side: THREE.DoubleSide } ), // back
    //     new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'assets/textures/test.png' ), side: THREE.DoubleSide } ), // front
    //     new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'assets/textures/test2.png' ), side: THREE.DoubleSide } ), // back
    //     new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'assets/textures/test.png' ), side: THREE.DoubleSide } ), // front
    //     new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( 'assets/textures/test2.png' ), side: THREE.DoubleSide } ), // back
    // ];

    mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 0xf6f5f1}));
    mesh.position.set(0,0,0); // Set the position of the mesh
    scene.add(mesh);
    drawn = true;
}

// function updateGallery() {
//     if(renderer && scene && camera && mesh) {
//         initiated = true;
//         year = data[0].year
//         awards = data[0].awards;
//         tags = data[0].tags.join(", ")

//         let prevIndex = 0;
        
//     }
// }

function updateGallery() {
    if ($section === 1) {
        const itemHeight = window.innerHeight;
        index = gallery ? Math.floor((scrollY - gallery?.parentElement?.offsetTop) / itemHeight) : 0;
        
        if (index >= numberOfSides) {
            index = numberOfSides - 1
        } else if (index < 0) {
            index = 0;
        }

        if (index !== prevIndex) {
            const indexData = data[index];
            if (indexData) {
                title = indexData.title;
                description = indexData.description;
                year = indexData.year;
                awards = indexData.awards.join(", ");
                tags = indexData.tags.join(", ");
            }
            prevIndex = index;
        }

        mesh.rotation.x += (angles[index].x - mesh.rotation.x) * 0.05;
        mesh.rotation.y += (angles[index].y - mesh.rotation.y) * 0.05;
        mesh.rotation.z += (angles[index].z - mesh.rotation.z) * 0.05;

        edges.rotation.x += (angles[index].x - edges.rotation.x) * 0.05;
        edges.rotation.y += (angles[index].y - edges.rotation.y) * 0.05;
        edges.rotation.z += (angles[index].z - edges.rotation.z) * 0.05;
        renderer.render(scene, camera);
    }
    window.requestAnimationFrame(updateGallery);
};

$: !drawn && canvas && drawPlatonicSolid(platonicSolid);

window.requestAnimationFrame(() => { updateGallery() })

$: windowHeight = 789; //window.innerHeight;
$: galleryHeight = windowHeight * numberOfSides;
    
    let innerWidth = window.innerWidth

    $: isMobile = innerWidth < 1000;

</script>

<svelte:window bind:innerWidth={innerWidth}/>

<div class="platonic-gallery" bind:this={gallery}>
    <div class="foreground" style={`height: ${galleryHeight}px`}></div>

    <div class="background" style="height: calc(100vh - 75px);">

        <div class="details-container">
            <div class="title">{@html title}</div>
            <div class="description">{description}</div>
            {#if !isMobile}
                <div class="details">
                    {#if awards}
                        <div class="detail">
                            <p class="section-subtitle">Awards</p>
                            <p class="detail-description">{awards}</p>
                        </div>
                    {/if}
                    <div class="detail">
                        <p class="section-subtitle">Tags</p>
                        <p class="detail-description">{tags}</p>
                    </div>
                    <!-- <div class="detail">
                        <p class="section-subtitle">Year</p>
                        <p class="detail-description">{year}</p>
                    </div> -->
                </div>
            {/if}
        </div>

        <div class="canvas"> 
            <canvas bind:this={canvas}></canvas>
        </div>

        {#if isMobile}
            <div class="details">
                    {#if awards}
                        <div class="detail">
                            <p class="section-subtitle">Awards</p>
                            <p class="detail-description">{awards}</p>
                        </div>
                    {/if}
                    <div class="detail">
                        <p class="section-subtitle">Tags</p>
                        <p class="detail-description">{tags}</p>
                    </div>
                    <!-- <div class="detail">
                        <p class="section-subtitle">Year</p>
                        <p class="detail-description">{year}</p>
                    </div> -->
                </div>
        {/if}
    </div>
</div>

<style>
    .platonic-gallery {
        display: flex;
        justify-content: center;
        width: min(90vw, 1000px);
        margin: 0 auto;
    }
    .background {
        width: 100%;
        position: sticky;
        top: 0px;
        display: flex;
        flex-direction: row;
        padding-top: 75px;
        height: calc(100vh - 75px); 
    }
    .details {
        margin-top: 50px;
    }
    .details-container {
        width: 375px;
        display: flex;
        flex-direction: column;
        margin: auto;
    }
    .canvas {
        height: min(80vh, 85vw);
        width: min(80vh, 85vw);
        margin: 0 auto;
        position: relative;
    }

    .title, .description, .details {
        margin: 5px 40px 0px 0px;
        font-family: 'Avenir';
    }
    .title {
        font-size: 28px;
    }
    @media screen and (max-width: 992px) {
        .background {
            flex-direction: column;
            padding-top: 50px;
            height: calc(100vh - 50px); 
            justify-content: center;
        }
        .details-container {
            width: min(100%, 400px);
            height: 100px;
            margin: 0 auto;
        }
        .canvas {
            height: min(80vh, 70vw);
            width: min(80vh, 70vw);
            margin: 10px auto;
        }
        canvas {
            width: 100% !important;
            height: 100% !important;
        }
        .detail-description {
            margin: 5px;
        }
        .section-subtitle {
            margin: 0px auto;
            padding-right: 0px;
            padding-bottom: 1px;
            font-size: 11px;
        }
        .details {
            height: 155px;
            margin: 0 auto;
        }
        .detail {
            padding-bottom: 10px;
        }
        .title {
            text-align: center;
            margin: 5px 0 0 0;
        }
        .description, .details {
            font-size: 14px;
            text-align: center;
            margin: 5px 0 0 0;
        }
    }

    @media screen and (max-width: 700px) {
        .img-container {
            max-height: min(80vh, 90vw, 500px);
            max-width: min(80vh, 90vw, 500px);
        }
        .canvas {
            height: min(80vh, 90vw, 500px);
            width: min(80vh, 90vw, 500px);
            margin: 10px auto;
        }
    }
</style>
