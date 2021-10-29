import { RestService } from '../../../utils/rest-service';

const serviceUri = 'service-subcon-fabric-washes';
const unitDeliveryOrderUri = 'garment-unit-delivery-orders';

class Service extends RestService {
    constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "garment-production");
    }

    search(info) {
        var endpoint = `${serviceUri}`;
        return super.list(endpoint, info);
    }

    searchComplete(info) {
        var endpoint = `${serviceUri}/complete`;
        return super.list(endpoint, info);
    }

    searchItem(info) {
        var endpoint = `${serviceUri}/item`;
        return super.list(endpoint, info);
    }

    create(data) {
        var endpoint = `${serviceUri}`;
        return super.post(endpoint, data);
    }

    read(id) {
        var endpoint = `${serviceUri}/${id}`;
        return super.get(endpoint);
    }

    update(data) {
        var endpoint = `${serviceUri}/${data.Id}`;
        return super.put(endpoint, data);
    }

    delete(data) {
        var endpoint = `${serviceUri}/${data.Id}`;
        return super.delete(endpoint, data);
    }

}


class PurchasingService extends RestService {
    constructor(http, aggregator, config, api) {
        super(http, aggregator, config, "purchasing-azure");
    }

    getGarmentEPO(info) {
        var endpoint = `${garmentEPOServiceUri}`;
        return super.list(endpoint, info);
    }
    getUnitDeliveryOrderById(id) {
        var endpoint = `${unitDeliveryOrderUri}/${id}`;
        return super.get(endpoint);
    }
    getUENById(id) {
        var endpoint = `${garmentUENServiceUri}/${id}`;
        return super.get(endpoint);
    }
    
}

export { Service, PurchasingService }