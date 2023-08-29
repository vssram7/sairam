import { LightningElement, api, wire } from 'lwc';
import findDoctors from '@salesforce/apex/doctorsList.getDoctorList';
import SAMPLEMC from "@salesforce/messageChannel/SampleMessageChannel__c"
import { MessageContext, publish } from 'lightning/messageService'
const columns = [{ label: 'Name', fieldName: 'Name' },
{ label: 'Account Name', fieldName: 'AccounttName' },
];

export default class Parent extends LightningElement {

    @api doctor;
    doctorId;
    @api getDoctor;
    error;
    clickDoctorDetail = false;
    // doctorAvailable = true;

    selectedDoctor = null;
    handleDoctor(event) {
        const doctorsName = event.detail
        this.selectedDoctor = this.getDoctor.find((item) => item.Name === doctorsName)
        console.log("selectedDoctor: " + JSON.stringify(this.selectedDoctor));
        this.clickDoctorDetail = true;
        alert(this.selectedDoctor.Avalable__c);
        if (this.selectedDoctor.Avalable__c == true) {
            console.log("1");
            this.doctorAvailable = true;
            console.log("2");
        }
        else {
            console.log("3");
            this.doctorAvailable = false;
            console.log("4");
        }

    }

    @wire(findDoctors)
    getDoctorList({ data, error }) {
        if (data) {
            let sData = JSON.parse(JSON.stringify(data));
            console.log('sData : ' + JSON.stringify(sData));
            this.getDoctor = sData;
            this.error = undefined;
        }
        else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }




    // handleViewProfileClick(event) {
    //     console.log("Slected tile :" + JSON.stringify(this.doctor));
    //     this.doctorId = this.doctor
    //     console.log("Slected Id :" + this.doctorId.Id);
    //     event.preventDefault();
    //     const selectEvent = new CustomEvent('select', {
    //         detail: this.doctorId
    //     });
    //     this.dispatchEvent(selectEvent);
    // }
}