import mongoose from "mongoose";


const orderItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    name: {
        type : String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    image: {
        type: String,
        required : true
    }
});

const ShippingAddressSchema = new mongoose.Schema({
    street: { type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    zipCode: { type: String, required: true},
    country: {type: String, required: true},
});

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    items: [orderItemSchema],

    customerInfo: {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type:String, required: true},
        phone: {type: String, required: true}
    },

    shippingAddress: ShippingAddressSchema,
    shippingMethod: {
        type: String,
        enum: ['free', 'standard', 'Overnight'],
        default: 'free'
    },
    shippingCost: {
        type: Number,
        required: true,
    },

    paymentMethod: {
        type: String,
        enum: ['credit-card', 'paypal', 'apple-pay'],
        required: true
    },

    lastFourDigits: String,

    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: [
            'pending',
            'processing',
            'shipped',
            'delivered',
            'cancelled',
            'refunded'
        ],
        default: 'pending'
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },

    trackingNumber: String,
    estimatedDelivery: Date,
    deliveredAt : Date
});

orderSchema.pre('save', async function() {
    this.updatedAt = new Date();
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;