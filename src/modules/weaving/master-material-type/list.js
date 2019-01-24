import { inject } from "aurelia-framework";
import { Service } from "./service";
import { Router } from "aurelia-router";

@inject(Router, Service)
export class List {
  context = ["detail"];
  columns = [
    { field: "code", title: "Kode Material" },
    { field: "name", title: "Nama Material" },
    { field: "description", title: "Keterangan" }
  ];

  loader = info => {
    var order = {};
    if (info.sort) order[info.sort] = info.order;

    var arg = {
      page: parseInt(info.offset / info.limit, 10),
      size: info.limit,
      keyword: info.search,
      order: order
    };

    return this.service.search(arg).then(result => {
      console.log(result.data);
      return {
        
        total: result.info.total,
        data: result.data
        // data: [
        //   {
        //     id: 1,
        //     yarnCode: "PC45",
        //     yarnName: "Cotton",
        //     yarnUnit: "Bale",
        //     yarnCurrencyCode: "IDR",
        //     yarnPrice: 70000
        //   },
        //   {
        //     id: 2,
        //     yarnCode: "PC21",
        //     yarnName: "Poly",
        //     yarnUnit: "Bale",
        //     yarnCurrencyCode: "IDR",
        //     yarnPrice: 120000
        //   }
        // ]
      };
    });

    // return {
    //   total: 2,
    //   // data: result.data
    //   data: [
    //     {
    //       id: 1,
    //       code: "01",
    //       name: "PC45",
    //       description: "some detail"
    //     }
    //   ]
    // };
  };

  constructor(router, service) {
    this.service = service;
    this.router = router;
  }

  contextCallback(event) {
    var arg = event.detail;
    var data = arg.data;
    switch (arg.name) {
      case "detail":
        this.router.navigateToRoute("view", { id: data.id });
        break;
    }
  }

  create() {
    this.router.navigateToRoute("create");
  }
}
