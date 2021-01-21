const {Schema,model} = require('mongoose');
const { userInfo } = require('os');

const MedicoSchema = Schema({
    nombre:{
        type: String,
        require:true
    },
    email:{
        type: String,
        require:true,
        unique:true

    },
    password:{
        type: String,
        require:true,        
    },
    img:{
        type: String,        
    },
    role:{
        type: String,
        require:true,
        default: 'USER_ROLE'
    },
    google:{
        type:Boolean,
        default: false
    }
});

MedicoSchema.method('toJSON',function(){
    const {_v,password,_id,...object}=this.toObject();

    object.uid = _id;
    return object;
});

module.exports= model('Medico',MedicoSchema);