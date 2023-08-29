import { LightningElement, wire, track } from 'lwc';
import findDoctors from '@salesforce/apex/doctorsList.collDoctors';

export default class ListOfDoctorsComponent extends LightningElement {

    @track searchKey = '';

    @wire(findDoctors, { searchKey: '$searchKey' })
    doctors;

    handleKeyChange(event) {
        this.searchKey = event.target.value;
    }

    handleViewProfileClick(event) {
        event.preventDefault();
        const selectEvent = new CustomEvent('select', {
            detail: "Hello"
        });
        this.dispatchEvent(selectEvent);
    }
}