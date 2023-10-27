// import { LightningElement, wire } from 'lwc';
// import SAMPLEMC from "@salesforce/messageChannel/SampleMessageChannel__c"
// import { MessageContext, publish } from 'lightning/messageService'
// export default class LmsComponentA extends LightningElement {
//     inputValue
// check
//     @wire(MessageContext)
//     context

//     inputHandler(event) {
//         this.inputValue = event.target.value
//     }

//     publishMessage() {
//         const message = {
//             lmsData: {
//                 value: this.inputValue
//             }
//         }
//         //publish(messageContext, messageChannel, message)
//         publish(this.context, SAMPLEMC, message)
//     }
// }


import { LightningElement, wire, api } from 'lwc';
import getDoctor from '@salesforce/apex/doctorsList.getDoctorList'

export default class PartnerSearchResult extends LightningElement {

    selectedDoctor;
    @api type = '';
    doctorList
    showModal = false;

    @wire(getDoctor, { type: '$type' })
    processOutput({ data, error }) {
        if (data) {
            console.log("data1 " + JSON.stringify(data));
            this.doctorList = data;
        }
        else if (error) {
            console.log("error " + error.body.message);
        }
    }

    /* viewDetails(event){
     const currentDoctor = event.detail
     console.log("currentDoctor "+event.detail);
     this.selectedDoctor = this.doctorList.find(item=>item.name === currentDoctor;
     this.showModal=true;
     }
 
     doctor={
         Name:'NOOOOO',
         Status__c:"Available",
         ProfilePicLink__c:'https://t4.ftcdn.net/jpg/02/60/04/09/360_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg',
         Specialisation__c:'Ortho'
     }*/
}