const QRCode = require('qrcode')


const text = "testinng"

const QrGenerate = async text => {
    try {
        const qr = await QRCode.toString(text, {type: 'terminal'})
        return qr
        // console.log(qr)
    } catch (error) {
        console.log(error);
    }
}

const qrGenerator = QrGenerate(text);
module.exports= qrGenerator