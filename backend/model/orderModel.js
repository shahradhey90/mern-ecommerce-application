const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  orderItems: [
    {
      Name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      image:{
        type:strinf,
        required:true
      },
      product:{
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required:true

      }

    },
  ],

  user:{
    type: mongoose.Schema.ObjectId,
    ref:"User",
    required:true
  },

  paymentInfo:{
    id:{
        type: String,
        required:true
    },

    status:{
        type: String,
        required:true
    },

    paidAt:{
        type: Date,
        required:true
    },

    itemsPrice:{
        type:Number,
        required:true
    }


  },
  
  shippingInfo: {

    address: {type: String, required: true},
    city:{type: String, required: true},
    state:{type:String, required: true},
    country:{type:String, required:true},
    pincode:{type:String, required:true},
    phoneNo:{type:Number, required:true},
    
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;