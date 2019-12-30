import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

/** Wire adapter to load records, utils to extract values. */
import { getRecord } from 'lightning/uiRecordApi';

/** Pub-sub mechanism for sibling component communication. */
import { registerListener, unregisterAllListeners } from 'c/pubsub';

/** Product__c Schema. */
import NAME_FIELD from '@salesforce/schema/Product__c.Name';
import LEVEL_FIELD from '@salesforce/schema/Product__c.Level__c';
import CATEGORY_FIELD from '@salesforce/schema/Product__c.Category__c';
import MATERIAL_FIELD from '@salesforce/schema/Product__c.Material__c';
import MSRP_FIELD from '@salesforce/schema/Product__c.MSRP__c';
import PICTURE_URL_FIELD from '@salesforce/schema/Product__c.Picture_URL__c';

/** Record fields to load. */
const fields = [
    NAME_FIELD,
    LEVEL_FIELD,
    CATEGORY_FIELD,
    MATERIAL_FIELD,
    MSRP_FIELD,
    PICTURE_URL_FIELD
];

export default class ProductDetails extends LightningElement {
    recordId;

    @wire(CurrentPageReference) pageRef;

    /** Load the Product__c to display. */
    @wire(getRecord, { recordId: '$recordId', fields })
    product;

    connectedCallback() {
        registerListener('productSelected', this.handleProductSelected, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    /**
     * Handler for when a product is selected. When `this.recordId` changes, the @wire
     * above will detect the change and provision new data.
     */
    handleProductSelected(productId) {
        this.recordId = productId;
    }

    get noData() {
        return !this.product.error && !this.product.data;
    }
}
