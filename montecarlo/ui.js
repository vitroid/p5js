var status = 0 // 0 before init, 1 running, 2 pausing

document.getElementById('idsig').value = sig*100;
document.getElementById('ideps').value = etemp;
document.getElementById('idtemperature').value = temperature;
document.getElementById('iddensity').value = density;
startButton.disabled = false

var startTime = 0

// function changeID() {
//     var id = Number(ID.value)
//     var iee = Math.floor(id / 4) - 1
//     var iss = (id + 3) % 4 - 1
//     //global values
//     sig = sig0 + 0.01 * iss
//     etemp = etemp0 + iee * 2
//     sigma.innerHTML = sig.toFixed(2)
//     epsilon.innerHTML = etemp.toFixed(1)
//     startButton.disabled = isNaN(etemp) || isNaN(sig) || isNaN(temperature) || isNaN(density)
// }

function simulate() {
    mclj.loop_manager()
    if (mclj.loop >= 2) {
        //completed.
        var deltaTime = ((new Date()).getTime() - startTime) / 1000
        output.innerHTML += "\n       Elapsed time [sec] " + deltaTime.toFixed(1) + "\n"
        status = 0
        startButton.value = "Start"
    } else if (status != 2)
        window.setTimeout(simulate, 1);   // runs as fast as pos
}

function startStop() {
    if (status == 1) {
        startButton.value = "Resume"
        status = 2
    }
    else {
        if (status == 0) {
            // ignore if density and temperature are not specified
            mclj = new MCLJ(etemp, sig, density, temperature)
            output.innerHTML = ""
        }
        status = 1
        startButton.value = " Pause "
        startTime = (new Date()).getTime()
        simulate()
    }
}

function changeS() {
    sig = Number(idsig.value) / 100 // MCでは長さの単位はAを使用
    startButton.disabled = isNaN(etemp) || isNaN(sig) || isNaN(temperature) || isNaN(density)
}

function changeE() {
    etemp = Number(ideps.value)
    startButton.disabled = isNaN(etemp) || isNaN(sig) || isNaN(temperature) || isNaN(density)
}

function changeT() {
    temperature = Number(idtemperature.value)
    startButton.disabled = isNaN(etemp) || isNaN(sig) || isNaN(temperature) || isNaN(density)
}

function changeD() {
    density = Number(iddensity.value)
    startButton.disabled = isNaN(etemp) || isNaN(sig) || isNaN(temperature) || isNaN(density)
}
