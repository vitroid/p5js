let status = 0 // 0 before init, 1 running, 2 pausing

document.getElementById('idsig').value = sig;
document.getElementById('ideps').value = eps;

// for debug
document.getElementById('idtemperature').value = Temperature;
document.getElementById('iddensity').value = Density;
startButton.disabled = false


// this is the loop control
function simulate() {
    if ( mdlj.steps % mdlj.Nstep == 0 ){
        output.innerHTML += "time [ps] || Epot [kJ/mol] || T [K] || p [MPa]\n\n"
    }
    mdlj.collective_progress()
    redraw()
    if ( mdlj.steps % mdlj.lsteps == 0 ){
        // 瞬間温度
        let T = mdlj.ek * 2 / (3 * Rgas)
        // compression factor
        let z = 1.0 - mdlj.vr / (3*Rgas*T)
        let pressure = z * Kboltzmann * T * mdlj.numdens * 1e36 * 1e-6
        output.innerHTML += (mdlj.dt * mdlj.steps).toFixed(2) + "\t" + (mdlj.ep*0.001).toPrecision(6)
        output.innerHTML += "\t" + T.toPrecision(6) + "\t" + pressure.toPrecision(6) + "\n"
    }

    if ( mdlj.steps % mdlj.Nstep == 0 ){
        let pkv = mdlj.average_and_clear()
        let ep = pkv[0]
        let ek = pkv[1]
        let vr = pkv[2]
        // 温度
        let T = ek * 2 / (3 * Rgas)
        // compression factor
        let z = 1.0 - vr / (3*Rgas*T)
        // mdlj.numdensは立方pmあたりの原子数なので、立方mあたりに換算する。
        let pressure = z * Kboltzmann * T * mdlj.numdens * 1e36 * 1e-6
        output.innerHTML += "\n                Time [ps] " + (mdlj.steps*mdlj.dt) + "\n"
        output.innerHTML += "               Sigma [pm] " + mdlj.sig.toFixed(0) + "\n"
        output.innerHTML += "           Epsilon/kB [K] " + mdlj.eps.toFixed(0) + "\n"
        output.innerHTML += "         Density [g /cm3] " + mdlj.densr.toPrecision(6) + "\n"
        output.innerHTML += "          Temperature [K] " + mdlj.tempr.toFixed(1) + "\n"
        output.innerHTML += "Potential Energy [kJ/mol] " + (ep*0.001).toPrecision(6) + "\n"
        output.innerHTML += "           Pressure [MPa] " + pressure.toPrecision(6) + "\n\n"
    }

    // 終了条件
    if (mdlj.stage <= 0) {
        // //completed.
        // var deltaTime = ((new Date()).getTime() - startTime) / 1000
        // output.innerHTML += "\n       Elapsed time [sec] " + deltaTime.toFixed(1) + "\n"
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
            // ignore if Density and Temperature are not specified
            mdlj = new MDLJ(eps, sig, Density, Temperature)
            output.innerHTML = ""
        }
        status = 1
        startButton.value = " Pause "
        startTime = (new Date()).getTime()
        simulate()
    }
}

function changeS() {
    sig = Number(idsig.value)
    startButton.disabled = isNaN(eps) || isNaN(sig) || isNaN(Temperature) || isNaN(Density)
}

function changeE() {
    eps = Number(ideps.value)
    startButton.disabled = isNaN(eps) || isNaN(sig) || isNaN(Temperature) || isNaN(Density)
}

function changeT() {
    Temperature = Number(idtemperature.value)
    startButton.disabled = isNaN(eps) || isNaN(sig) || isNaN(Temperature) || isNaN(Density)
}

function changeD() {
    Density = Number(iddensity.value)
    startButton.disabled = isNaN(eps) || isNaN(sig) || isNaN(Temperature) || isNaN(Density)
}
