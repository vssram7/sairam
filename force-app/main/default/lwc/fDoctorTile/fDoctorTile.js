import { LightningElement, api } from 'lwc';

export default class FDoctorTile extends LightningElement {

    @api getDoctor;
    selectedId;
    selectedDoctor = null;

    handleLoad() {
        this.selectedDoctor = this.getDoctor.find((item) => item.Id === selectedId)
        console.log("selectedDoctorIn: " + JSON.stringify(this.selectedDoctor));
        console.log("is its:" + this.selectedDoctor.Avalable__c);
        if (this.selectedDoctor.Avalable__c == true) {
            this.bookAppointmentdisable = false;
        }
        else {
            this.bookAppointmentdisable = true;
        }
    }

    handleViewProfileClick(event) {
        this.selectedId = event.target.value;
        const selectedDoctor = new CustomEvent('select', {
            detail: event.target.value
        })
        this.dispatchEvent(selectedDoctor)
    }
}