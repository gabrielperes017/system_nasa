
import {createPlanet, createAllPlanets, orbitalElements} from './js/planets.js';
import {updateOrbit} from './js/orbits.js';
import { showPlanetInfo, hidePlanetInfo } from './js/hud.js';
import { centerOnPlanet, resetCameraToOriginalPosition } from './js/camera.js';

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(45, (window.innerWidth/100*85) / (window.innerHeight-4), 0.1, 3000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth/100*85, window.innerHeight-4);
renderer.shadowMap.enabled = true; // Habilitar sombras
document.getElementById('earth-container').appendChild(renderer.domElement);

// Carregador de texturas
const textureLoader = new THREE.TextureLoader();



// Criação do Sol com brilho emissivo
const sun = createPlanet(75, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Map_of_the_full_sun.jpg/1280px-Map_of_the_full_sun.jpg', 0xffdd00, textureLoader);
sun.castShadow = false; // O Sol não projeta sombra
scene.add(sun);

var planets = createAllPlanets(textureLoader, scene);

// Luz ambiente suave para iluminar ligeiramente todos os objetos
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Aumentar a intensidade
scene.add(ambientLight);

// Luz do Sol (PointLight) para simular a iluminação (agora branca)
const sunLight = new THREE.PointLight(0xffffff, 4.0, 3000);  // Intensidade e alcance ajustados
sunLight.position.set(0, 0, 0);  // No centro da cena, onde está o Sol
sunLight.castShadow = true;  // Habilitar sombras
sunLight.shadow.mapSize.width = 2048;  // Alta resolução de sombras
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 1500;
scene.add(sunLight);

// Ajuste da posição inicial da câmera
camera.position.set(0, 0, 700); // Afastando a câmera para que o sistema solar caiba
camera.lookAt(0, 0, 0);

// Variáveis de controle
let isCenteredOnPlanet = false;
export let originalCameraPosition = camera.position.clone();
let isPaused = false;

// Períodos orbitais (aproximados em anos e dias da Terra)

const orbitalPeriods = {
    earth: 365,
    moon: 273.00,
    venus: 225,
    mercury: 88,
    mars: 687,
    phobos: 12.5,
    deimos: 30.3,
    jupiter: 4331.572,
    saturn: 10759,
    uranus: 30799.095,
    neptune: 60190,
    pluto: 90613.305

};

// Conversão dos períodos orbitais em velocidades de translação
const orbitalSpeeds = {
    earth: 1  / orbitalPeriods.earth,
    moon: 1 / orbitalPeriods.moon,
    venus: 1 / orbitalPeriods.venus,
    mercury: 1 / orbitalPeriods.mercury,
    mars: 1 / orbitalPeriods.mars,
    phobos: 1 / orbitalPeriods.phobos,
    deimos: 1 / orbitalPeriods.deimos,
    jupiter: 1 / orbitalPeriods.jupiter,
    saturn: 1 / orbitalPeriods.saturn,
    uranus: 1 / orbitalPeriods.uranus,
    neptune: 1 / orbitalPeriods.neptune,
    pluto: 1 / orbitalPeriods.pluto,

};

// Variáveis de órbita e ângulos para os planetas
let earthOrbit = { radius: 200, speed: orbitalSpeeds.earth, angle: 0 };
let moonOrbit = { radius: 35, speed: orbitalSpeeds.moon, angle: 0 };
let venusOrbit = { radius: 138, speed: orbitalSpeeds.venus, angle: 0 };
let mercuryOrbit = { radius: 90, speed: orbitalSpeeds.mercury, angle: 0 };
let marsOrbit = { radius: 290, speed: orbitalSpeeds.mars, angle: 0 };
let phobosOrbit = { radius: 7, speed: orbitalSpeeds.phobos, angle: 0 };
let deimosOrbit = { radius: 5, speed: orbitalSpeeds.deimos, angle: 90 };
let jupiterOrbit = { radius: 600, speed: orbitalSpeeds.jupiter, angle: 0 };
let saturnOrbit = { radius: 800, speed: orbitalSpeeds.saturn, angle: 0 };
let uranusOrbit = { radius: 900, speed: orbitalSpeeds.uranus, angle: 0 };
let neptuneOrbit = { radius: 1000, speed: orbitalSpeeds.neptune, angle: 0 };
let plutoOrbit = { radius: 1100, speed: orbitalSpeeds.pluto, angle: 0 };

// Velocidades de rotação mais realistas (em radianos por quadro)

const mercuryRotationSpeed = 0.0002;
const venusRotationSpeed = 0.0004;
const earthRotationSpeed = 0.01;
const moonRotationSpeed = 0.001;
const marsRotationSpeed = 0.008;
const phobosRotationSpeed = 0.001;
const deimosRotationSpeed = 0.001;
const jupiterRotationSpeed = 0.003;
const saturnRotationSpeed = 0.005;
const uranusRotationSpeed = 0.002;
const neptuneRotationSpeed = 0.002;
const plutoRotationSpeed = 0.00637;


// Animação
function animate() {
    const orbits = [
        { orbit: mercuryOrbit, index: 0 },
        { orbit: venusOrbit, index: 1 },
        { orbit: earthOrbit, index: 2 },
        { orbit: moonOrbit, index: 3 },
        { orbit: marsOrbit, index: 4 },
        { orbit: phobosOrbit, index: 5 },
        { orbit: deimosOrbit, index: 6 },
        { orbit: jupiterOrbit, index: 7 },
        { orbit: saturnOrbit, index: 8 },
        { orbit: uranusOrbit, index: 9 },
        { orbit: neptuneOrbit, index: 10 },
        { orbit: plutoOrbit, index: 11 }
    ];

    const rotationSpeeds = [
        mercuryRotationSpeed,
        venusRotationSpeed,
        earthRotationSpeed,
        moonRotationSpeed,
        marsRotationSpeed,
        phobosRotationSpeed,
        deimosRotationSpeed,
        jupiterRotationSpeed,
        saturnRotationSpeed,
        uranusRotationSpeed,
        neptuneRotationSpeed,
        plutoRotationSpeed
    ];

    

    // Atualiza a movimentação orbital e rotação dos planetas em loop
    orbits.forEach(({ orbit, index }) => {
        let velo = document.getElementById('velocidade').value;
        orbit.angle = updateOrbit(planets[index], orbit.radius, orbit.speed * velo, orbit.angle);
        if(index == 9){
            planets[index].rotation.x += rotationSpeeds[index] * velo;
        }else{
            planets[index].rotation.y += rotationSpeeds[index] * velo;
        }
        
    });

    // Renderização
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}


animate();

// Ajusta o renderizador quando a janela é redimensionada
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

export function procurar(){
    let valor = document.getElementById("nome-do-planeta").value;
    console.log("funcionou")
    resetCameraToOriginalPosition()
    
    function fck(){
        centerOnPlanet(planets[valor]);
    }

    setTimeout(fck, 1000);
}

document.getElementById("nome-do-planeta").addEventListener("change", procurar);
