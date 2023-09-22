//Variables y Selectores
const $formulario = document.querySelector("#agregar-gasto")
const $gastosListado = document.querySelector("#gastos ul")
const $total = document.querySelector("#total")
const $restante = document.querySelector("#restante")

let presupuesto;


// Eventos
eventListeners()
function eventListeners() {
    document.addEventListener ("DOMContentLoaded", preguntarPresupuesto)
    $formulario.addEventListener ("submit", handleSubmit)
}


// Classes
class Presupuesto {
    constructor (presupuesto){
        this.presupuesto = presupuesto;
        this.restante = presupuesto;
        this.gastos = [];
    }

    agregarGasto(objGasto){
        this.gastos.push(objGasto)
        this.calcularRestante()
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto) => total+gasto.cantidad, 0 )
        this.restante = this.presupuesto- gastado
    }

    borrarGasto(id) {
        const gastosActualizados = this.gastos.filter( gasto => gasto.id !== id)
        this.gastos= gastosActualizados;
        this.calcularRestante()
    }
    
}

class UI {
    insertarPresupuesto ( objPresupuesto ){
        const {presupuesto, restante} = objPresupuesto;
        $total.textContent = presupuesto
        $restante.textContent = restante
    }

    imprimirAlerta (msg, tipo){
        const $divMsg = document.createElement("DIV");
        $divMsg.id="alerta"

        $divMsg.classList.add ("text-center","alert")

        if (tipo === "error"){
            $divMsg.classList.add("alert-danger")
        }
        else {
            $divMsg.classList.add("alert-success")
        }

        $divMsg.textContent=msg;
        const $contenidoPrimario = document.querySelector(".primario")
        $contenidoPrimario.insertBefore($divMsg, $formulario)

        setTimeout ( () => {
            $divMsg.remove()
        },3000)
    }

    mostrarGastoLista (arrGastos) {

        const $ulGastos = document.querySelector(".list-group");

        arrGastos.forEach( gasto => {
            const $liGasto = document.createElement("li")
            $liGasto.className = "list-group-item d-flex justify-content-between align-items-center"
            $liGasto.innerHTML = `${gasto.nombre} <span class="badge badge-primary badge-pill">${gasto.cantidad}</span>`
            $liGasto.dataset.id = gasto.id;
            
            //btn borrar
            const $btnBorrar = document.createElement("button");
            $btnBorrar.className = "btn btn-danger borrar-gasto"
            $btnBorrar.textContent = "Borrar x"
            //agregar btn a li
            $liGasto.appendChild($btnBorrar)
            //agregar li a ul
            $ulGastos.appendChild($liGasto)

            //funcion borrar del btnBorrar
            $btnBorrar.onclick = () => {
                borrarGasto(gasto.id)
            }
        });
    }

    resetGastoLista () {
        const $ulGastos = document.querySelector(".list-group");
        if ($ulGastos){
            $ulGastos.replaceChildren("")
        }
    }

    actualizarRestante (restante){
        $restante.textContent = restante
    }

    comprobarPresupuesto (objPresupuesto){
        const $restanteDiv = document.querySelector(".restante")
        const {presupuesto, restante } = objPresupuesto;
        if (restante < presupuesto*0.25 ) {
            $restanteDiv.classList.remove("alert-success")
            $restanteDiv.classList.remove("alert-warning")
            $restanteDiv.classList.add("alert-danger")
        }
        else if (restante> presupuesto*0.25 && restante < presupuesto *0.75) {
            $restanteDiv.classList.remove("alert-success")
            $restanteDiv.classList.remove("alert-danger")
            $restanteDiv.classList.add("alert-warning")
        } 
        else if (restante> presupuesto*0.75){   
            $restanteDiv.classList.remove("alert-danger")
            $restanteDiv.classList.remove("alert-warning")
            $restanteDiv.classList.add("alert-success")

        }
    }


}


// Instancias
const ui = new UI(); //global



// Funciones
function preguntarPresupuesto () {
    const presupuestoUsuario = parseFloat(prompt("¿Cual es tu presupuesto?"))

   if (presupuestoUsuario === "" || presupuestoUsuario === null || presupuestoUsuario <= 0) {
    alert("Debe escribir al menos un valor positivo")
    window.location.reload()
   }

   if (isNaN(presupuestoUsuario)){
    alert("No debe colocar un número")
    window.location.reload()
   }

   presupuesto = new Presupuesto(presupuestoUsuario)
   ui.insertarPresupuesto(presupuesto)
}

function handleSubmit (e) {
    e.preventDefault()
    const nombre = document.getElementById("gasto").value;
    const cantidad = parseFloat(document.getElementById("cantidad").value);
    const $alerta = document.querySelector("#alerta")

    if (nombre === "" || cantidad === "" || !isNaN(nombre) || isNaN(cantidad) || cantidad <= 0)  {
        if (!$alerta) {
            ui.imprimirAlerta("Debe ingresar un nombre de gasto válido y un gasto mayor que cero","error")
        }
        return;
    }
    else {
        const objGasto = {nombre, cantidad, id: Date.now()};
        presupuesto.agregarGasto(objGasto);
        if (!$alerta) {
            ui.imprimirAlerta("Agregado correctamente","success")
        }

        $formulario.reset()
        ui.resetGastoLista()
        ui.mostrarGastoLista(presupuesto.gastos)
        ui.actualizarRestante(presupuesto.restante)
        ui.comprobarPresupuesto(presupuesto)
    }

    


}

function borrarGasto(id) {
    presupuesto.borrarGasto(id)
    ui.resetGastoLista()
    ui.mostrarGastoLista(presupuesto.gastos)
    ui.actualizarRestante(presupuesto.restante)
    ui.comprobarPresupuesto(presupuesto)
}