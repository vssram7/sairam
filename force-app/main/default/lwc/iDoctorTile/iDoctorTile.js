import { LightningElement, api, wire } from 'lwc';
import findDoctors from '@salesforce/apex/doctorsList.collDoctors';
import SAMPLEMC from "@salesforce/messageChannel/SampleMessageChannel__c"
import { MessageContext, publish } from 'lightning/messageService'

export default class DoctorstileComponent extends LightningElement {

    @api doctor;
    doctorId;
    @api doctorAvailable;
    // bookAppointmentdisable = true;

    // @wire(MessageContext)
    // context

    connectedCallback() {
        this.loadRelatedContact();
    }
    loadRelatedContact() {
        getRelatedContacts()
            .then(results => {
                this.data = JSON.parse(JSON.stringify(results));
                console.log("JSON.stringify===> " + JSON.stringify(results));
                if (this.data.length > 0) {
                    this.data = results;
                    this.isError = false;
                }
                else {
                    this.isError = true;
                }
            }).
            catch(error => {
                this.isError = true;
            });
    }


    bookAppointmentdisable() {
        if (JSOdoctorAvalable__c == true) {
            this.bookAppointmentdisable = false;
        }
        else {
            console.log(JSON.stringify(doctor));
            this.bookAppointmentdisable = true;
        }
    }

    handleViewProfileClick() {
        this.doctorId = this.doctor.Id;
        console.log("Id is" + this.doctorId);
        const message = {
            lmsData: {
                value: this.doctorId
            }
        }
        //publish(messageContext, messageChannel, message)
        publish(this.context, SAMPLEMC, message)
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