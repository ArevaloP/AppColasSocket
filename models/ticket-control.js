const path = require('path');
const fs   = require('fs');

class Ticket{
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}


class TicketControl{

    constructor(){
        this.ultimo   = 0;
        this.hoy      = new Date().getDate();
        this.tickets  = [];
        this.ultimos4 = [];

        this.init();
    }

    get toJSON(){
        return{
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }
    }

    init(){
        const {hoy, tickets, ultimo, ultimos4} = require('../database/data.json');
        if (hoy === this.hoy){
            this.tickets  = tickets;
            this.ultimo   = ultimo;
            this.ultimos4 = ultimos4;
        }else{
            this.guardarDB();
        }
    }

    guardarDB(){

        const dbPath = path.join(__dirname, '../database/data.json');
        fs.writeFileSync(dbPath, JSON.stringify(this.toJSON));

    }

    siguiente(){
        this.ultimo += 1;
        const ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);

        this.guardarDB();
        return 'Ticket: ' + ticket.numero;
    }

    atenderTicket(escritorio){
        //No tenemos tickets
        if(this.tickets.length === 0){
            return null;
        }

        //La funcion shift, remueve el primer elemento de la lista y lo retorna 
        const ticket = this.tickets.shift(); // this.tickets[0];
        ticket.escritorio = escritorio;

        //La funcion unshift añade un elemento a la primera posición de la lista
        this.ultimos4.unshift(ticket);

        if (this.ultimos4.length > 4){
            this.ultimos4.splice(-1,1);
        }

        this.guardarDB();

        return ticket;
    }

}

module.exports = TicketControl;