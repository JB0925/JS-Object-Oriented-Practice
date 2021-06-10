class Vehicle {
    constructor(make, model, year) {
        this.make = make[0].toUpperCase() + make.slice(1).toLowerCase();
        this.model = model[0].toUpperCase() + model.slice(1).toLowerCase();
        this.year = year;
    }

    honk() {
        return 'Beep.'
    }
    
    toString() {
        return `The vehicle is a ${this.make} ${this.model} from ${this.year}.`
    }
}

class Car extends Vehicle {
    constructor(make, model, year) {
        super(make, model, year);
        this.numWheels = 4;
    }
}

class Motorcycle extends Vehicle {
    constructor(make, model, year) {
        super(make, model, year);
        this.numWheels = 2;
    }

    revEngine() {
        return 'VROOM!!!';
    }
}

class Garage {
    constructor(capacity) {
        this.capacity = capacity;
        this.vehicles = [];
    }

    add(vehicle) {
        const validVehicles = 'Car Motorcycle'.split(' ');
        if (validVehicles.indexOf(vehicle.constructor.name) === -1) {
            return 'Only vehicles are allowed in here!';
        }
        if (this.vehicles.length >= this.capacity) {
            return 'Sorry, we\'re full.'
        }
        this.vehicles.push(vehicle);
        return 'Vehicle added!';
    }
}
