//Referencias HTML
const lblEscritorio = document.querySelector('h1');
const btnAtender    = document.querySelector('button');
const lblTicket     = document.querySelector('small');
const divAlert      = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')){
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}


const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

divAlert.style.display = 'none';


const socket = io();



socket.on('connect', () => {
    
    btnAtender.disabled = false;

});

socket.on('disconnect', () => {
    
    btnAtender.disabled = true;

});


socket.on('tickets-pendientes', (tickes)=>{

    if(tickes === 0){
        divAlert.style.display = '';
        lblPendientes.style.display = 'none';
    }else{
        divAlert.style.display = 'none';
        lblPendientes.style.display = '';
        lblPendientes.innerText = tickes;
    }

});


btnAtender.addEventListener( 'click', () => {



    socket.emit('atender-ticket', {escritorio}, ({ok, ticket, msg})=>{
        if(!ok){
        lblTicket.innerText = `Nadie.`;
            return divAlert.style.display = '';
        }

        lblTicket.innerText = `Ticket: ${ticket.numero}`;

    });

    // socket.emit( 'siguiente-ticket', null, ( ticket ) => {
    //     lblNuevoTicket.innerText = ticket;
    // });

});



