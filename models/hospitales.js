const {Schema,model} = require('mongoose');
const { userInfo } = require('os');

const HospitalSchema = Schema({
    nombre:{
        type: String,
        require:true
    },
    calle:{
        type: String,
        require:true,
        unique:true

    },    
    img:{
        type: String,        
    },    
    google:{
        type:Boolean,
        default: false
    }
});

HospitalSchema.method('toJSON',function(){
    const {_v,_id,google,...object}=this.toObject();

    object.uid = _id;
    return object;
});

module.exports= model('Hospitale',HospitalSchema);