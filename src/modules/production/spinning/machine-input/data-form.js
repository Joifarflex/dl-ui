import { inject, bindable, computedFrom } from 'aurelia-framework'
import { Service, CoreService } from './service';
import { debug } from 'util';
import { Numeric } from '../../../../components/form/basic/numeric';

var UnitLoader = require('../../../../loader/unit-azure-loader');
var MaterialTypeLoader = require('../../../../loader/material-types-loader');
var LotConfigurationLoader = require('../../../../loader/lot-configuration-loader');

// var moment = require('moment');
@inject(Service, CoreService)
export class DataForm {
    @bindable isCreate = false;
    @bindable isEdit = false;
    @bindable isView = false;
    @bindable readOnly;
    @bindable data;
    @bindable error;
    @bindable title;
    @bindable unit;
    @bindable yarn;
    @bindable lot;
    @bindable processType;
    @bindable inputDate;
    @bindable shift;
    @bindable group;

    formOptions = {
        cancelText: "Kembali",
        saveText: "Simpan",
        editText: "Ubah",
        deleteText: "Hapus",
    };
    typeOptions = []
    yarnTypeList = [
        "",
        "PCP",
        "CMP",
        "CD",
        "CVC",
        "PE",
        "TENCEL",
        "CUPRO",
        "PC-P 45"
    ];

    controlOptions = {
        label: {
            length: 4
        },
        control: {
            length: 5
        }
    }
    itemColumns = ["Nomor Mesin", "Merk Mesin", "Input", "UOM"];
    spinningFilter = { "DivisionName.toUpper()": "SPINNING" };
    shiftOptions = ["", "Shift I: 06.00 – 14.00", "Shift II: 14.00 – 22.00", "Shift III: 22:00 – 06.00"]
    items = [];
    constructor(service, coreService) {
        this.service = service;
        this.coreService = coreService;
    }
    machineSpinningFilter = {};
    masterFilter = {};

    bind(context) {
        this.context = context;
        console.log(this.context)
        this.data = this.context.data;
        this.error = this.context.error;

        this.coreService.getMachineTypes()
            .then(result => {
                if (this.data.ProcessType) {
                    console.log(1)
                    this.typeOptions = result;
                } else {
                    this.typeOptions.push("");
                    for (var list of result) {
                        this.typeOptions.push(list);
                    }
                }
            });
        if (this.data.UnitDepartment && this.data.UnitDepartment.Id) {
            this.unit = this.data.UnitDepartment;
        }
        if (this.data.LotConfiguration && this.data.LotConfiguration.Id) {
            this.lot = this.data.LotConfiguration;
        }
        if (this.data.ProcessType) {
            this.processType = this.data.ProcessType;
        }

        if (this.data.YarnMaterialType && this.data.YarnMaterialType.Id) {
            this.yarn = {};
            this.yarn.id = this.data.YarnMaterialType.Id;
            this.yarn.name = this.data.YarnMaterialType.Name;
            this.yarn.code = this.data.YarnMaterialType.Code;
        }

        if (this.data.Date) {
            this.inputDate = this.data.Date;
        }

        if (this.data.Shift) {
            this.shift = this.data.Shift;
        }

        if (this.data.Group) {
            this.group = this.data.Group;
        }

        if (this.data.Items) {
            for (var item of this.data.Items) {
                item.Identity = item.Id;
                item.MachineSpinningIdentity = item.MachineSpinning.Id;
            }
        }

    }

    inputInfo = {
        columns: [
            { header: "Nama Serat", value: "Product" },
            { header: "Komposisi", value: "Composition" },
        ],
        onAdd: function () {
            this.data.Details.push({ ProductName: {}, Hank: 0 });
        }.bind(this),
        onRemove: function () {
            this.context.machineCollections.bind();

        }.bind(this)
    };

    addItemCallback = (e) => {
        this.data.Items = this.data.Items || [];
        this.data.Items.push({})
    };

    removeItemCallback(item, event) {
        this.data.Items.splice(item.context.Items.indexOf(Items.data), 1);
    }

    unitChanged(newValue, oldValue) {
        console.log(newValue)
        console.log(this.unit)
        if (this.unit && this.unit.Id) {
            this.data.UnitDepartmentId = this.unit.Id;

            this.fillItems();
        } else {
            this.data.UnitDepartmentId = null;
            this.data.Items = [];
        }
    }

    lotChanged(n, o) {
        if (this.lot && this.lot.Id) {
            this.data.LotConfigurationId = this.lot.Id;
            this.fillItems();
        } else {
            this.data.LotConfigurationId = null;
            this.data.Items = [];
        }
    }

    inputDateChanged(n, o) {
        if (this.inputDate) {
            this.data.Date = this.inputDate;
            this.fillItems();
        } else {
            this.data.Date = null;
            this.data.Items = [];
        }
    }

    yarnChanged(n, o) {
        if (this.yarn && this.yarn.id) {
            this.data.YarnMaterialTypeId = this.yarn.id;
            this.fillItems();
        } else {
            this.data.YarnMaterialTypeId = null;
            this.data.Items = [];
        }
    }

    processTypeChanged(n, o) {
        console.log(this.processType)
        if (this.processType) {
            this.data.ProcessType = this.processType;

            this.fillItems();
        } else {
            this.data.ProcessType = null;
            this.data.Items = [];
        }
    }

    shiftChanged(n, o) {
        if (this.shift) {
            this.data.Shift = this.shift;
            this.fillItems();
        } else {
            this.data.Shift = null;
            this.data.Items = [];
        }
    }

    groupChanged(n, o) {
        if (this.group && this.group != "") {
            this.data.Group = this.group;
            this.fillItems();
        } else {
            this.data.Group = null;
            this.data.Items = [];
        }

    }

    async fillItems() {
        if (!this.readOnly && this.data.UnitDepartmentId && this.data.ProcessType && this.data.YarnMaterialTypeId && this.data.LotConfigurationId && this.data.Date && this.data.Shift && this.data.Group && this.data.Group != "") {
            this.machineSpinningFilter.page = 1;
            this.machineSpinningFilter.size = 2147483647;
            this.machineSpinningFilter.order = { "No": "asc" }
            // this.machineSpinningFilter.filter = { "Type": this.data.ProcessType, "UnitId": this.data.UnitDepartmentId }
            this.filter = {};
            this.filter.Type = this.data.ProcessType;
            this.filter.UnitId = this.data.UnitDepartmentId.toString();
            this.machineSpinningFilter.filter = JSON.stringify(this.filter);

            this.data.Items = await this.coreService.searchMachineSpinning(this.machineSpinningFilter)
                .then(async results => {
                    let existedItem = {};

                    if (this.data.Id) {
                        existedItem = this.data;
                    } else {
                        existedItem = await this.service.getByHeader(this.data.Date, this.processType, this.yarn.id, this.lot.Id, this.data.Shift, this.data.Group, this.unit.Id);
                        if (existedItem.Items && existedItem.Items.length > 0) {
                            alert("Data already exist with this configuration");
                            this.inputDate = undefined;
                            this.processType = this.typeOptions[0];
                            this.yarn = undefined;
                            this.lot = undefined;
                            this.shift = this.shiftOptions[0];
                            this.group = undefined;
                            this.unit = undefined;
                            return [];
                        }
                    }
                    // results.data = results.data.filter((el) => !existedItem.Items.some((al) => el.Id == al.MachineSpinning.Id));

                    var newItems = [];
                    for (var item of results.data) {
                        var dbItem = existedItem.Items.find(x => x.MachineSpinning.Id == item.Id);

                        var newData = {};
                        newData.MachineSpinning = {};
                        newData.Input = dbItem ? dbItem.Input : 0;
                        newData.MachineSpinning.No = item.No;
                        newData.MachineSpinning.Name = item.Name;
                        newData.MachineSpinning.UomUnit = item.UomUnit;
                        newData.MachineSpinning.Id = item.Id;
                        newData.MachineSpinningIdentity = item.Id;
                        newItems.push(newData);
                    }
                    return newItems;
                });

        }
    }


    get unitLoader() {
        return UnitLoader;
    }

    get materialTypeLoader() {
        return MaterialTypeLoader;
    }

    get lotConfigurationLoader() {
        return LotConfigurationLoader;
    }
} 