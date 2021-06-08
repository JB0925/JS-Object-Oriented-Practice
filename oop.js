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
    numwheels() {
        return 4
    }
}
