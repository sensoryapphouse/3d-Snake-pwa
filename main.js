// Options: speed
// hold or tap
// mute
//
//Add
// Sound effects
// Input methods

window.addEventListener('load', function () {
    //    if ('serviceWorker' in navigator) {
    //        navigator.serviceWorker
    //            .register('./sw.js');
    //    }

    panel = document.querySelector('panel');
    settings = document.querySelector('settings');
    splash = document.querySelector('splash');
    setUpPanel();

    splash.onclick = function () {
        hideSplash();
    }
});

function hideSplash() {
    splash.hidden = true;
    InitSounds();
    start();
}

var panel;
var panelvisible = false;
var settings;
var splash;
var speed;
var s1;
var s2;
var mute;
var timeScale = 1;
var activateOnSwitchDown = false;
var leftKey = false;
var rightKey = false;


var firsttime = true;
var pop;
var eat;
var drop;

function PlaySound(s) {
    if (mute.checked)
        return;
    try {
        switch (s) {
            case 'pop.mp3':
                pop.play();
                break
            case 'eat.mp3':
                eat.play();
                break;
            case 'drop.mp3':
                drop.play();
                break;
        }
    } catch (e) {};
}

function InitSounds() {
    if (firsttime) {
        pop = new Audio('sounds/pop.mp3');
        pop.volume = 0;
        pop.play();
        eat = new Audio('sounds/eat.mp3');
        eat.volume = 0;
        eat.play();
        drop = new Audio('sounds/drop.mp3');
        drop.volume = 0;
        drop.play();
        setTimeout(function () {
            pop.pause();
            eat.pause();
            drop.pause();
            pop.volume = 1;
            eat.volume = 1;
            drop.volume = 1;
        }, 500);
        firsttime = false;
    }
}

function setUpPanel() {
    panel.style.left = "130vw";
    slideTo(panel, 130);
    mute = document.createElement("INPUT");
    mute.style.position = "absolute";
    mute.style.height = "3vh";
    mute.style.width = "3vw";
    mute.style.left = "16vw";
    mute.style.top = "4vh";
    mute.checked = false;
    mute.setAttribute("type", "checkbox");
    mute.checked = false;
    speed = document.createElement("INPUT");
    speed.setAttribute("type", "range");
    speed.style.position = "absolute";
    speed.style.height = "2vh";
    speed.style.width = "15vw";
    speed.style.left = "4.4vw";
    speed.style.top = "13.5vh";
    speed.style.color = 'green';
    speed.value = 3;
    speed.min = 1;
    speed.max = 5;

    s1 = document.createElement("INPUT");
    s1.style.position = "absolute";
    s1.style.height = "3vh";
    s1.style.width = "3vw";
    s1.style.left = "13vw";
    s1.style.top = "21.5vh";
    s2 = document.createElement("INPUT");
    s2.style.position = "absolute";
    s2.style.height = "3vh";
    s2.style.width = "3vw";
    s2.style.left = "6vw";
    s2.style.top = "21.5vh";
    s1.setAttribute("type", "radio");
    s2.setAttribute("type", "radio");

    s1.checked = true;

    function setTimeScale() {
        timeScale = (7 - speed.value) / 4;
    }

    function switchOption(i) {
        switch (i) {
            case 1:
                s1.checked = true;
                s2.checked = false;
                localStorage.setItem("3DSnake.onUp", 1);
                break;
            case 2:
                s2.checked = true;
                s1.checked = false;
                localStorage.setItem("3DSnake.onUp", 0);
                break;
        }
    }

    s1.onclick = function (e) {
        switchOption(1);
    }
    s2.onclick = function (e) {
        switchOption(2);
    }

    panel.appendChild(mute);
    panel.appendChild(speed);
    panel.appendChild(s1);
    panel.appendChild(s2);

    settings.style.left = "92vw";
    // Retrieve settings
    var s = localStorage.getItem("3DSnake.mute");
    mute.checked = (s == "true");
    s = parseInt(localStorage.getItem("3DSnake.speed"));
    if (s < 1 || s > 5)
        s = 3;
    speed.value = s.toString();
    setTimeScale();
    s = localStorage.getItem("3DSnake.onUp");
    if (s == 1) switchOption(1);
    else
        switchOption(2);

    mute.onclick = function (e) {
        localStorage.setItem("3DSnake.mute", mute.checked);
    }
    speed.onclick = function (e) {
        localStorage.setItem("3DSnake.speed", speed.value);
        setTimeScale();
    }

    panel.onmousedown = function (e) { // speed, paddle size, ball size
        e.stopPropagation();
    }
    panel.onmouseup = function (e) { // speed, paddle size, ball size
        e.stopPropagation();
    }

    settings.onmousedown = function (e) { // speed, paddle size, ball size
        e.stopPropagation();
        if (panelvisible) { // save stored values
            slideTo(panel, 130);
            slideTo(settings, 92);
        } else {
            slideTo(panel, 75);
            slideTo(settings, 78);
        }
        panelvisible = !panelvisible;
    }

    function slideTo(el, left) {
        var steps = 5;
        var timer = 50;
        var elLeft = parseInt(el.style.left) || 0;
        var diff = left - elLeft;
        var stepSize = diff / steps;
        console.log(stepSize, ", ", steps);

        function step() {
            elLeft += stepSize;
            el.style.left = elLeft + "vw";
            if (--steps) {
                setTimeout(step, timer);
            }
        }
        step();
    }
}


function start() {
    console.log = function () {};
    const SCALE = 27;
    const PI = Math.PI;
    var leftArrow = document.getElementById("left");
    var rightArrow = document.getElementById("right");
    var foodWidth = 0.5;
    var objectWidth = 1;
    var eatVar = 0;
    var distance = 0;
    var bodyArray = [];
    var q = 0;
    var qVar = 0;
    var fixedLength = 0;
    var myTimer = [];
    var collArray = [];
    var spawned = 0;
    var scoreId = document.getElementById('scoreId');
    scoreId.style.fontSize = "xx-large";
    var toungeWidth = 1;
    var newPositionx = 0;
    var newPositiony = 0;
    var rotationSpeed = 0.05;
    var posNeg = 0;
    var negPos = 0;
    var q1 = 0;
    var q2 = 0;
    var colorVarNegPos = 1;
    var zArray = [];
    var zTimer = [];
    var zVar = 0;
    var pauseVar = 0;
    var pauseMessageVar = 0;
    var mapVar = 0;
    var tailCollisionVar = 0;
    var arrowVar = 0;
    var myCollisionVar = 0;
    var difficultVar = 10;
    var ballTimerVar = 320;

    //Camera values
    const FOV = 45; // 45
    const ASPECT = window.innerWidth / window.innerHeight;
    const NEAR = .1; //0.1;
    const FAR = 2000;
    var alpha = 0;
    var updatedHead = 0;

    // ********** Initialize GUI (Graphical user interface) **********
    //    var gui = new dat.GUI();
    //    var guiParams = { //Sets the variable names and default values of the GUI
    //        cameraPosition: false
    //    };
    //    gui.add(guiParams, 'cameraPosition').name('POV'); //Button that sets camera position equal to car position
    //gui.closed = true;

    // ********** Creating the scene: **********
    var renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    }); //Creates a WebGL renderer using threejs library

    renderer.setPixelRatio(window.devicePixelRatio); //Prevents blurry output
    renderer.setSize(window.innerWidth, window.innerHeight); //Sets renderer size to the size of the window
    renderer.setClearColor(0xA9F5F2, 0); //Makes the background color of the scene blue
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    document.body.appendChild(renderer.domElement); //Attaches renderer to DOM (initializes renderer)

    var scene = new THREE.Scene(); //Creates an empty scene where we are going to add our objects

    var camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR); //Creates a camera
    camera.up.set(0, 0, 1); //Sets the camera the correct direction
    scene.add(camera); //Adds the camera to the scene

    var controls = new THREE.OrbitControls(camera, renderer.domElement); //OrbitControls allows camera to be controlled and orbit around a target
    controls.minDistance = 1000 / SCALE; //Sets the minimum distance one can pan into the scene
    //controls.maxDistance = 1000/SCALE;  //Sets the maximum distance one can pan away from scene
    controls.update();
    controls.enabled = false; // PB stop user moving view point
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight); //Adding ambient light
    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, 2);
    light.castShadow = true;

    var d = 35;
    light.shadowCameraLeft = d;
    light.shadowCameraRight = -d;
    light.shadowCameraTop = d;
    light.shadowCameraBottom = -d;

    scene.add(light);

    var helper = new THREE.CameraHelper(light.shadow.camera);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function clearHighlight() {
        leftArrow.style.backgroundColor = "transparent";
        rightArrow.style.backgroundColor = "transparent";
    }

    function lDown() {
        clearHighlight()
        if (arrowVar == 0) {
            leftKey = true;
            rightKey = false;
            leftArrow.style.backgroundColor = "orange";
        }
        if (pauseVar == 1) {
            resetGame();
        }
    }

    function lUp() {
        clearHighlight();
        if (arrowVar == 0) {
            leftKey = false;
            rightKey = false;
        }
    }

    function rDown() {
        clearHighlight()
        if (arrowVar == 0) {
            rightKey = true;
            leftKey = false;
            rightArrow.style.backgroundColor = "orange";
        }
        if (pauseVar == 1) {
            resetGame();
        }
    }

    function rUp() {
        clearHighlight();
        if (arrowVar == 0) {
            rightKey = false;
            leftKey = false;
        }
    }

    function leftStart() {
        if (s1.checked)
            lDown();
        else {
            if (leftKey) {
                lUp();
            } else
                lDown();
        }

    }

    function leftEnd() {
        if (s1.checked)
            lUp();
    }

    function rightStart() {
        if (s1.checked)
            rDown();
        else {
            if (rightKey) {
                rUp();
            } else
                rDown();
        }
    }

    function rightEnd() {
        if (s1.checked)
            rUp();
    }

    leftArrow.addEventListener("touchstart", leftStart);
    rightArrow.addEventListener("touchstart", rightStart);
    leftArrow.addEventListener("touchend", leftEnd);
    rightArrow.addEventListener("touchend", rightEnd);
    leftArrow.addEventListener("mousedown", leftStart);
    rightArrow.addEventListener("mousedown", rightStart);
    document.addEventListener("mouseup", function () {
        leftEnd();
        rightEnd();
    });
    document.addEventListener("keydown", function (e) {
        if (e.repeat)
            return;
        switch (e.keyCode) {
            case 49:
            case 37:
                leftStart();
                break;
            case 50:
            case 51:
            case 52:
            case 39:
                rightStart();
                break;
        }
    });
    document.addEventListener("keyup", function (e) {
        switch (e.keyCode) {
            case 49:
            case 37:
                leftEnd();
                break;
            case 50:
            case 51:
            case 52:
            case 39:
                rightEnd();
                break;
        }
    });

    window.addEventListener("resize", onWindowResize);

    leftStart();
    rightStart();
    leftEnd();
    rightEnd();

    var width = 50; //width of ground
    var length = 50; //length of ground

    var geometry = new THREE.PlaneGeometry(width, length); //ThreeJS function to create plane geometry
    var texture;
    texture = new THREE.TextureLoader().load("grass.jpg");
    var groundmat = new THREE.MeshLambertMaterial({ //Sets color and material attributes for plane
        color: 0x088A08,
        map: texture,
        opacity: 1,
        side: THREE.FrontSide //Ground visible from both sides
    });
    var ground = new THREE.Mesh(geometry, groundmat); //Creates a mesh containing the geometry and groundmaterial just defined
    ground.receiveShadow = true;
    //    const myAxis = new THREE.Vector3(0, 0, 1);
    //    // rotate the mesh 45 on this axis
    //    ground.rotateOnWorldAxis(myAxis, THREE.Math.degToRad(45));

    scene.add(ground); //Adds ground to scene

    var geometry = new THREE.SphereGeometry(objectWidth, 32, 32);
    var material = new THREE.MeshLambertMaterial({
        color: 0x00ff00,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
    });

    function spawnCircle() {
        window.myObject = new THREE.Mesh(geometry, material);
        myObject.receiveShadow = true;
        myObject.castShadow = true;
        scene.add(myObject);
    }
    spawnCircle();
    myObject.position.z = 1.1;

    function spawnFace(eyeSize, xPosition, yPosition, colorVar) {
        var geometryFace = new THREE.SphereGeometry(eyeSize, 32, 32);

        var materialFace = new THREE.MeshLambertMaterial({
            color: colorVar,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 1
        });

        window.myFace = new THREE.Mesh(geometryFace, materialFace);

        myObject.add(myFace);

        myFace.position.z = 0.3;
        myFace.position.y = -objectWidth + yPosition;
        myFace.position.x = xPosition;

    }
    //Size, x, y, color
    spawnFace(0.2, 0.4, 0.2, 0xffffff);
    spawnFace(0.2, -0.4, 0.2, 0xffffff);
    spawnFace(0.1, 0.4, 0, 0x000000);
    spawnFace(0.1, -0.4, 0, 0x000000);


    function spawnTounge(toungeWidth) {
        var toungeGeometry = new THREE.BoxGeometry(0.1, toungeWidth, 0.1);
        var toungeMaterial = new THREE.MeshLambertMaterial({
            color: 0xff0000
        });
        window.myTounge = new THREE.Mesh(toungeGeometry, toungeMaterial);
        myObject.add(myTounge);
        myTounge.position.z = -0.4;
        myTounge.position.y = (-objectWidth) - 0.2;
    }
    spawnTounge(toungeWidth);

    function splitTounge(rotationVar, positionVar) {
        var toungeGeometry2 = new THREE.BoxGeometry(0.1, 0.5, 0.1);
        var toungeMaterial2 = new THREE.MeshLambertMaterial({
            color: 0xff0000
        });
        window.myTounge2 = new THREE.Mesh(toungeGeometry2, toungeMaterial2);
        myTounge.add(myTounge2);
        myTounge2.position.y = -toungeWidth / 2 - 0.1;
        myTounge2.rotation.z = rotationVar;
        myTounge2.position.x = positionVar;
    }
    // Rotation, x
    splitTounge(PI / 3, 0.2);
    splitTounge(-PI / 3, -0.2);

    function moveTounge() {
        myTounge.rotation.z = (Math.sin(myObject.position.x)) / 5;
        myTounge.rotation.x = (Math.sin(myObject.position.y)) / 6;
    }

    var bodyGeometry = new THREE.SphereGeometry(objectWidth, 32, 32);

    function spawnBody(colorVar2) {
        var bodyMaterial = new THREE.MeshLambertMaterial({
            color: colorVar2,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 1
        });
        var bug;
        window.newBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
        newBody.receiveShadow = true;
        newBody.castShadow = true;
        scene.add(newBody);
        newBody.position.y = bug;
        newBody.position.z = 1.1;
        return (newBody);
    }

    myArray = [];
    myArray.push(spawnBody(0x33cc33));
    myArray.push(spawnBody(0x00ff00));

    function spawnApple() {
        var appleGeometry = new THREE.SphereGeometry(1.0, 32, 32);
        var appleMaterial = new THREE.MeshLambertMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 1
        });

        window.myFood = new THREE.Mesh(appleGeometry, appleMaterial);
        myFood.receiveShadow = true;
        myFood.castShadow = true;

        generateNumber();

        scene.add(myFood);
        myFood.position.z = 8;
        myFood.position.x = newPositionx;
        myFood.position.y = newPositiony;
    }
    spawnApple();

    function spawnAppleStilk() {

        var stilkGeometry = new THREE.BoxGeometry(0.04, 0.04, 1);
        var stilkMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000
        });
        window.myStilk = new THREE.Mesh(stilkGeometry, stilkMaterial);
        myFood.add(myStilk);
        myStilk.position.z = 0.17;
    }
    spawnAppleStilk();

    function foodDescend() {
        if (myFood.position.z >= (foodWidth / 2) + 0.2) {
            myFood.position.z -= 0.2;
        }
    }

    function generateNumber() {
        posNeg = Math.random();
        if (posNeg > 0.5) {
            q1 = -1;
        } else {
            q1 = 1;
        }
        negPos = Math.random();
        if (negPos > 0.5) {
            q2 = -1;
        } else {
            q2 = 1;
        }

        newPositionx = q1 * Math.random() * 20;
        newPositiony = q2 * Math.random() * 20;

        return (newPositionx, newPositiony);
    }

    function placeObj(moveObj) {
        if (tailCollisionVar == 0) {
            alpha = moveObj.rotation.z;
            moveObj.position.y -= Math.cos(alpha) / difficultVar;
            moveObj.position.x += Math.sin(alpha) / difficultVar;

            if (rightKey == true) {
                moveObj.rotation.z -= rotationSpeed / timeScale;

            } else if (leftKey == true) {
                moveObj.rotation.z += rotationSpeed / timeScale;
            }
        }
    }

    function yum() {
        PlaySound("eat.mp3");
        scene.remove(myFood);
        spawnApple();
        spawnAppleStilk();
        eatVar += 1;
        myCollisionVar = eatVar;
        colorVarNegPos = colorVarNegPos * -1;

        collArray = [];
        collArray = bodyArray.slice(q, bodyArray.length);

        scoreId.innerHTML = "#: " + eatVar;
        for (qTimer = 0; qTimer < myTimer.length; qTimer++) {
            clearTimeout(myTimer[qTimer]);
        }

        fixedLength = myArray.length;
        myTimer = [];
        bodyArray = [];
        q = 0;
        qVar = 0;
        spawned = 1;

        if (colorVarNegPos < 0) {
            myArray.push(spawnBody(0x33cc33));
        } else if (colorVarNegPos > 0) {
            myArray.push(spawnBody(0x00ff00));
        }
    }

    function bugArray() {
        if (spawned == 1) {
            for (i = 0; i <= (fixedLength - 1); i++) {
                myArray[i].position.x = collArray[qVar];
                myArray[i].position.y = collArray[qVar + 1];

                qVar = qVar + 2;
            }
            if (qVar >= collArray.length) {
                spawned = 0;
            }
        }
    }

    function ateFood() {
        if ((myObject.position.x <= (myFood.position.x + (objectWidth + foodWidth / 2))) && (myObject.position.x >= (myFood.position.x - (objectWidth + foodWidth / 2)))) {
            if (myObject.position.y <= (myFood.position.y + (objectWidth + foodWidth / 2)) && myObject.position.y >= (myFood.position.y - (objectWidth + foodWidth / 2))) {
                yum();
            }
        }
    }

    camera.position.set(myObject.position.x - 40, myObject.position.y - 40, 20);

    function enablePOV() {
        if (false) { //(guiParams.cameraPosition == true) {
            //            camera.position.set(myObject.position.x, myObject.position.y, myObject.position.z + 1.04);
            //            camera.lookAt(2000 * (Math.sin(alpha) / 10), -2000 * (Math.cos(alpha) / 10), myObject.position.z - 0.1);
            //
            //            if (updatedHead == 0) {
            //                myObject.material.needsUpdate = true;
            //                myObject.receiveShadow = false;
            //
            //                updatedHead = 1;
            //            }
        } else {
            controls.update();
            firstTime = false;
            if (updatedHead == 1) {
                myObject.material.needsUpdate = true;
                myObject.receiveShadow = true;

                updatedHead = 0;
            }
        }
    };

    function collectPosition() {
        bodyArray.push(myObject.position.x);
        bodyArray.push(myObject.position.y);

        for (i = 0; i <= (myArray.length - 2); i++) {
            bodyArray.push(myArray[i].position.x);
            bodyArray.push(myArray[i].position.y);
        }

        myTimer.push(setTimeout(setPosition, ballTimerVar));

        function setPosition() {
            for (i = 0; i <= (myArray.length - 1); i++) {
                myArray[i].position.x = bodyArray[q];
                myArray[i].position.y = bodyArray[q + 1];

                q = q + 2;

            }
        }
    }

    function endOfMap() {

        if (myObject.position.x > width / 2) {
            mapVar = 1;
            zFunction();
        } else if (myObject.position.x < -width / 2) {
            mapVar = 1;
            zFunction();
        } else if (myObject.position.y > length / 2) {
            mapVar = 1;
            zFunction();
        } else if (myObject.position.y < -length / 2) {
            mapVar = 1;
            zFunction();
        }
    }

    function zFunction() {
        zArray.push(myObject.position.z);

        for (i = 0; i <= (myArray.length - 2); i++) {
            zArray.push(myArray[i].position.z);
        }

        zTimer.push(setTimeout(zPosition, ballTimerVar - 20));

        function zPosition() {
            for (i = 0; i <= (myArray.length - 1); i++) {
                myArray[i].position.z = zArray[zVar];
                zVar = zVar + 1;
            }
        }
        myObject.position.z -= 0.2;
        pause();
    }

    function tailCollision() {
        if (myCollisionVar >= 3) {
            for (i = 3; i <= (myArray.length - 1); i++) {
                if ((myObject.position.x >= myArray[i].position.x - objectWidth) && (myObject.position.x <= myArray[i].position.x + objectWidth)) {
                    if ((myObject.position.y >= myArray[i].position.y - objectWidth) && (myObject.position.y <= myArray[i].position.y + objectWidth)) {
                        PlaySound("pop.mp3");
                        pause();
                        myCollisionVar = 0;
                    }
                }
            }
        }
    }

    function pause() {
        clearHighlight();
        arrowVar = 1;
        rightKey = false;
        leftKey = false;
        leftArrow.style.opacity = "0";
        rightArrow.style.opacity = "0";
        if (pauseMessageVar == 0 && mapVar == 1) {
            setTimeout(pauseMessage, (myArray.length + 1) * ballTimerVar);
            PlaySound("drop.mp3");

            function pauseMessage() {
                leftArrow.style.opacity = "1";
                rightArrow.style.opacity = "1";
                pauseVar = 1;
                arrowVar = 0;

                for (qTimer = 0; qTimer < zTimer.length; qTimer++) {
                    clearTimeout(zTimer[qTimer]);
                }
            }
            pauseMessageVar = 1;
            mapVar = 0;
        } else if (pauseMessageVar == 0 && mapVar == 0) {
            tailCollisionVar = 1;
            setTimeout(pauseMessage2, (myArray.length + 1) * ballTimerVar);

            function pauseMessage2() {
                leftArrow.style.opacity = "1";
                rightArrow.style.opacity = "1";
                pauseVar = 1;
                arrowVar = 0;
            }
            pauseMessageVar = 1;
        }
    }

    function resetGame() {
        scoreId.style.fontSize = "xx-large";
        for (i = 2; i <= (myArray.length - 1); i++) {
            scene.remove(myArray[i]);
        }

        myArray = [myArray[0], myArray[1]];
        myArray[0].position.x = 0;
        myArray[1].position.x = 0;
        myArray[0].position.y = 0;
        myArray[1].position.y = 0;
        myArray[0].position.z = 1.1;
        myArray[1].position.z = 1.1;
        myObject.position.x = 0;
        myObject.position.y = 0;
        myObject.position.z = 1.1;
        eatVar = 0;
        scoreId.innerHTML = "#: " + eatVar;

        myTimer = [];
        bodyArray = [];
        zArray = [];

        colorVarNegPos = 1;
        q = 0;
        qVar = 0;
        zVar = 0;
        mapVar = 0;
        spawned = 0;
        tailCollisionVar = 0;
        pauseMessageVar = 0;
        pauseVar = 0;
    }

    function increaseDifficulty() {
        if (eatVar < 5) {
            difficultVar = 10;
            ballTimerVar = (320 / 10) * 10;
        } else if (eatVar < 10) {
            difficultVar = 9;
            ballTimerVar = (320 / 10) * 9;
        } else if (eatVar < 20) {
            difficultVar = 8;
            ballTimerVar = (320 / 10) * 8;
        } else if (eatVar < 40) {
            difficultVar = 7;
            ballTimerVar = (320 / 10) * 7;
        } else if (eatVar < 70) {
            difficultVar = 6;
            ballTimerVar = (320 / 10) * 6;
        }
        difficultVar *= timeScale;
        ballTimerVar *= timeScale;
    }

    //    swal("🐍 3D Snake 🐍", "Instructions:\n🍎Control the snake and eat as many apples as you can!🍎");
    pauseVar = 1;
    //    scoreId.innerHTML = "◀️\nPress to start\n▶️";

    //********** Render function **********
    var render = function () {
        requestAnimationFrame(render); //render function is called every frame!
        bugArray();
        increaseDifficulty();
        if (pauseVar == 0) {
            placeObj(myObject);
            collectPosition();
            endOfMap();
        }
        ateFood();
        enablePOV();
        moveTounge();
        foodDescend();
        tailCollision();
        renderer.render(scene, camera); //We need this in the loop to perform the rendering
    };
    render();

    function showPressedButton(index) {
        if (!splash.hidden) { // splash screen
            hideSplash();
        } else {
            switch (index) {
                case 8:
                case 9:
                    break;
                case 0: // A
                case 2: // X
                case 14: // LEFT
                case 4: // LT
                case 6: //
                    leftStart();
                    break;
                case 1: // B
                case 3: // Y
                case 5: // RT
                case 7: //
                case 15: // RIGHT
                    rightStart();
                    break;
                case 10: // XBox
                    break;
                case 12: // dpad 
                    // increase speed
                    break;
                case 13:
                    // decrease speed
                    break;
                default:
            }
        }
    }

    function removePressedButton(index) {
        switch (index) {
            case 0: // A
            case 2: // X
            case 14: // LEFT
            case 4: // LT
            case 6: //
                leftEnd();
                break;
            case 1: // B
            case 3: // Y
            case 5: // RT
            case 7: //
            case 15: // RIGHT
                rightEnd();
                break;
            default:
        }
    }

    var gpad;

    gamepads.addEventListener('connect', e => {
        console.log('Gamepad connected:');
        console.log(e.gamepad);
        gpad = e.gamepad;
        e.gamepad.addEventListener('buttonpress', e => showPressedButton(e.index));
        e.gamepad.addEventListener('buttonrelease', e => removePressedButton(e.index));
    });

    gamepads.addEventListener('disconnect', e => {
        console.log('Gamepad disconnected:');
        console.log(e.gamepad);
    });

    gamepads.start();
}
