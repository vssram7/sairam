import { LightningElement, wire, track, api } from 'lwc';

export default class Child extends LightningElement {


    @api getDoctor;

    handleViewProfileClick(event) {
        const selectDoctor = new CustomEvent('select', {
            detail: event.target.name
        })
        console.log("Lets see:" + event.target.name);
        this.dispatchEvent(selectDoctor)
    }



}