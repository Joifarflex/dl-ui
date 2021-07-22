import { inject, bindable, containerless, computedFrom, BindingEngine } from 'aurelia-framework'
import { Service } from "./service";
import { CoreService } from "./core-service";

const DivisionLoader = require('../../../loader/division-loader');
const CurrencyLoader = require('../../../loader/currency-loader');
const UnitVBNonPO = require('../../../loader/unit-vb-non-po-loader');
const VbLoader = require('../../../loader/vb-request-document-loader');

@containerless()
@inject(Service, BindingEngine, CoreService)
export class DataForm {
    @bindable readOnly = false;
    @bindable data = {};
    @bindable error = {};
    @bindable title;

    @computedFrom("data.VBNonPOType")
    get isVB() {
        return this.data.VBNonPOType == "Dengan Nomor VB";
    }

    @computedFrom("data.Id")
    get isEdit() {
        return (this.data.Id || '').toString() != '';
    }

    filter = {
        "ApprovalStatus": 2,
        "IsRealized": false,
        "Type": 2,
        "IsInklaring": false
    };

    controlOptions = {
        label: {
            length: 4
        },
        control: {
            length: 5
        }
    }

    controlOptionsLabel = {
        label: {
            length: 8
        },
        control: {
            length: 3
        }
    }

    controlOptionsDetail = {
        control: {
            length: 10
        }
    }

    unitQuery = { VBDocumentLayoutOrder: 0 }
    get unitVBNonPOLoader() {
        return UnitVBNonPO;
    }

    NumberVbOptions = ["", "Dengan Nomor VB", "Tanpa Nomor VB"];

    itemOptions = {};
    constructor(service, bindingEngine, coreService) {
        this.service = service;
        this.bindingEngine = bindingEngine;
        this.coreService = coreService;
    }

    bind(context) {
        this.context = context;
        this.data = this.context.data;
        this.error = this.context.error;

        if (this.data.VBNonPOType) {
            this.vbNonPOType = this.data.VBNonPOType;
        }

        if (this.data.VBDocument) {
            this.vbDocument = this.data.VBDocument;
        }

        if (this.data.Currency) {
            this.currency = this.data.Currency;
        }

        if (this.data.Division) {
            this.division = this.data.Division;
        }

    }


    cards = [];

    @bindable division;
    divisionChanged(n, o) {
        if (this.division) {
            this.data.Division = this.division;
            this.itemOptions.DivisionId = this.data.Division.Id;
        } else {
            this.data.Division = null;
        }
    }

    @bindable currency;
    currencyChanged(n, o) {
        if (this.currency) {
            this.data.Currency = this.currency;
            this.itemOptions.CurrencyId = this.data.Currency.Id;

        } else {
            this.data.Currency = null;
        }
    }

    otherUnitSelected(event, data) {
        this.cardContentUnit = null;
        data.Amount = 0;
        data.Unit = {};
        data.Unit.VBDocumentLayoutOrder = 10;
    }

    resetAmount(event, data) {
        data.Amount = 0;
    }

    columns = [
        "No. Disposisi"
    ];

    get addItems() {
        return (event) => {
            this.data.Items.push({})
        };
    }

    get vbLoader() {
        return VbLoader;
    }

    unitView = (unit) => {
        return `${unit.Code} - ${unit.Name}`
    }

    get divisionLoader() {
        return DivisionLoader;
    }

    get currencyLoader() {
        return CurrencyLoader;
    }

}