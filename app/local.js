var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var LocalSchema = new Schema({
    nombre: {type: String, required: true},
    ubicacion: {type: [Number], required: true}, 
    genero :{type: String, required: true},
    edades: {type: String, required:true},
    tipo: {type: String, required : true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

LocalSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

LocalSchema.index({location: '2dsphere'});

module.exports = mongoose.model('local', LocalSchema);
