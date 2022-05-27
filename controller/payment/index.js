
//Import lowDB
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
var md5 = require('md5');
var randomid = require('randomid');
var random = require('random');
const { log } = require('debug');
var random = require('random');
const { sortObject } = require('../../public/utils');
const { vnPay } = require('../payment/vnpay');
const { momo } = require('../payment/momo');

//End of Import lowDB
//Date time
var d = new Date();

// function sortObject(o) {
//     var sorted = {},
//         key, a = [];

//     for (key in o) {
//         if (o.hasOwnProperty(key)) {
//             a.push(key);
//         }
//     }

//     a.sort();

//     for (key = 0; key < a.length; key++) {
//         sorted[a[key]] = o[a[key]];
//     }
//     return sorted;
// }

//Thanh toan
//POST trang thanh toan
module.exports.thanhtoan = function (req, res, next) {
    var name = req.cookies.info.username;
    var role = "";

    if (req.cookies.info.role) {
        role = req.cookies.info.role;
    }
    var id = req.body.id;
    var find = db.get('Chuyenmuc').value();
    var mathang = db.get('MatHang').find({ id: id }).cloneDeep().value();

    // Kiểm tra coi có giá km ko
    var date1 = new Date(mathang.hankm)
    var date2 = new Date()
    if ((date1.getTime() >= date2.getTime()) && (mathang.giakm != "")) {
        mathang.gia = mathang.giakm;
    }

    var chuyenmuc = db.get('Chuyenmuc').value();

    res.render('thanhtoan', { chuyenmuc: chuyenmuc, mathang: mathang, name: name, find: find, role: role });

}
//Xac nhan thanh toan
//POST trang hoadon
module.exports.hoadon = function (req, res, next) {
    var id = req.body.id;
    var soluongdat = req.body.soluongdat;
    var usr = req.cookies.info.username;
    var mathang = db.get('MatHang').find({ id: id }).cloneDeep().value();
    var find = db.get('Chuyenmuc').value();
    var role = "";

    if (req.cookies.info.role) {
        role = req.cookies.info.role;
    }
    // Kiểm tra coi có giá km ko
    var date1 = new Date(mathang.hankm)
    var date2 = new Date()
    if ((date1.getTime() >= date2.getTime()) && (mathang.giakm != "")) {
        mathang.gia = mathang.giakm;
    }

    var chuyenmuc = db.get('Chuyenmuc').value();
    var donhang = { id: id, soluongdat: soluongdat, usr: usr, mathang: mathang, }
    console.log(soluongdat);

    res.render('hoadon', { chuyenmuc: chuyenmuc, mathang: mathang, donhang: donhang, name: usr, soluongdat: soluongdat, find: find, role: role });
}
//POST xac nhan thanh toan
module.exports.xacnhanthanhtoan = async (req, res, next) => {
    var thanhtoan = req.body.thanhtoan;
    var id = req.body.id;
    var idhoadon = randomid();
    var magiaodich = randomid();
    var usr = req.cookies.info.username;

    //--------
    //Neu muon dung Redirect thi dong dong ben duoi
    // res.status(200).json({code: '00', data: vnpUrl})
    //Neu muon dung Redirect thi mo dong ben duoi va dong dong ben tren

    //Tạo hóa đơn với trạng thái chưa thanh toán
    //start

    var thanhtien = req.body.thanhtien;
    var soluongdat = req.body.soluongdat;
    // var thoigian = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear() + "-" + d.getHours() + "h" + d.getMinutes() + "p";
    var thoigian = d;
    var mathang = db.get('MatHang').find({ id: id }).value();
    var find = db.get('Chuyenmuc').value();

    // Kiểm tra coi có giá km ko
    var date1 = new Date(mathang.hankm)
    var date2 = new Date()
    var gia;
    if ((date1.getTime() >= date2.getTime()) && (mathang.giakm < mathang.gia)) {
        gia = mathang.giakm
    } else {
        gia = mathang.gia
    }

    var chuyenmuc = db.get('Chuyenmuc').value();

    // { req, res, next, thanhtoan, id, idhoadon, magiaodich, usr, d, db }
    var donhang = {
        idhoadon: idhoadon, magiaodich: magiaodich, thanhtoan: thanhtoan, usr: usr,
        hang: [{ ten: mathang.ten, gia: gia, id: id, soluongdat: soluongdat }],
        thanhtien: thanhtien, idgiohang: 0, thoigian: thoigian, trangthai: 'chuathanhtoan'
    };
    db.get('HoaDon')
        .push(donhang)
        .write()

    //-------



    if (thanhtoan == 'vnpay') {
        //Qua trang sandbox VNPAY
        return vnPay({ req, res, next, thanhtoan, id, idhoadon, magiaodich, usr, d, db });

    } else if (thanhtoan == "momo") {
        res.redirect(await momo({donhang}));


    } else {

        var thanhtien = req.body.thanhtien;
        var soluongdat = req.body.soluongdat;
        // var thoigian = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear() + "-" + d.getHours() + "h" + d.getMinutes() + "p";
        var thoigian = d;
        var mathang = db.get('MatHang').find({ id: id }).value();
        var find = db.get('Chuyenmuc').value();

        // Kiểm tra coi có giá km ko
        var date1 = new Date(mathang.hankm)
        var date2 = new Date()
        var gia;
        if ((date1.getTime() >= date2.getTime()) && (mathang.giakm < mathang.gia)) {
            gia = mathang.giakm
        } else {
            gia = mathang.gia
        }

        var chuyenmuc = db.get('Chuyenmuc').value();

        var donhang = { idhoadon: idhoadon, magiaodich: magiaodich, thanhtoan: thanhtoan, usr: usr, hang: [{ ten: mathang.ten, gia: gia, id: id, soluongdat: soluongdat }], thanhtien: thanhtien, idgiohang: 0, thoigian: thoigian, trangthai: 'dathanhtoan' };
        db.get('HoaDon')
            .push(donhang)
            .write()

        var name = req.cookies.info.username;
        var role = "";

        if (req.cookies.info.role) {
            role = req.cookies.info.role;
        }
        res.render('thongtinhoadon', { chuyenmuc: chuyenmuc, mathang: mathang, donhang: donhang, name: name, role: role, find: find });
    }
}

//GET Lich su giao dich
module.exports.lichsudathang = function (req, res, next) {

    var usr = req.cookies.info.username;
    var role;
    if (req.cookies.info.username) {
        role = req.cookies.info.role;
    }

    var chuyenmuc = db.get('Chuyenmuc').value();
    var hoadon = db.get('HoaDon')
        .value()
    var danhsach = []
    hoadon.forEach(element => {
        if (element.usr == usr && element.trangthai == 'dathanhtoan') {
            danhsach.push(element);
        }
    });
    console.log("role la " + role);

    res.render('lichsudathang', { hoadon: danhsach, name: usr, role: role });
}

//GET Đơn hàng chưa thanh toán
module.exports.donhangchuathanhtoan = function (req, res, next) {

    var usr = req.cookies.info.username;
    var role;
    if (req.cookies.info.username) {
        role = req.cookies.info.role;
    }

    // var chuyenmuc = db.get('Chuyenmuc').value();
    var hoadon = db.get('HoaDon')
        .value()
    var danhsach = []
    hoadon.forEach(element => {
        if (element.usr == usr && element.trangthai == 'chuathanhtoan') {
            danhsach.push(element);
        }
    });
    danhsach.sort(function (a, b) {
        return b.thoigian.localeCompare(a.thoigian);
    });
    
    res.render('donhangchuathanhtoan', { hoadon: danhsach, name: usr, role: role });
}

//Post Đơn hàng chưa thanh toán
module.exports.postdonhangchuathanhtoan = function (req, res, next) {
    var name = req.cookies.info.username;
    var idhoadon = req.body.idhoadon;

    var hoadon = db.get("HoaDon").find({ idhoadon: idhoadon }).value();
    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var config = require('config');
    var dateFormat = require('dateformat');


    var tmnCode = config.get('vnp_TmnCode');
    var secretKey = config.get('vnp_HashSecret');
    var vnpUrl = config.get('vnp_Url');
    var returnUrl = config.get('vnp_ReturnUrl');

    var date = new Date();

    var createDate = dateFormat(date, 'yyyymmddHHmmss');
    var orderId = dateFormat(date, 'HHmmss');
    //Thông tin cần cho thanh toán
    var amount = hoadon.thanhtien;;  //Số tiền
    var bankCode = '';  //Mã thẻ

    var orderInfo = idhoadon; //Thông tin order
    var orderType = 'billpayment';  //Loại order
    var locale = 'vn';  //Ngôn ngữ
    if (locale === null || locale === '') {
        locale = 'vn';
    }
    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var querystring = require('qs');
    var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });

    var sha256 = require('sha256');

    var secureHash = sha256(signData);

    vnp_Params['vnp_SecureHashType'] = 'SHA256';
    vnp_Params['vnp_SecureHash'] = secureHash;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true });
    res.redirect(vnpUrl)
}

//Post Chi tiet lich su don hang
module.exports.chitietlichsudonhang = function (req, res, next) {
    var name = req.cookies.info.username;

    var idhoadon = req.body.idhoadon;
    var role = "";

    if (req.cookies.info.role) {
        role = req.cookies.info.role;
    }
    var donhang = db.get('HoaDon')
        .find({ idhoadon: idhoadon })
        .value();

    res.render('chitietlichsudonhang', { donhang: donhang, name: name, role: role });
}
//Thanh toan gio hang
module.exports.thanhtoangiohang = function (req, res, next) {
    var idgiohang = req.body.idgiohang;
    var username = req.cookies.info.username;
    var chuyenmuc = db.get('Chuyenmuc').value();
    var giohang = db.get('GioHang').find({ idgiohang: idgiohang }).cloneDeep().value();
    var find = db.get('Chuyenmuc').value();
    var tongtien = 0;
    giohang.mathang.forEach(element => {
        // Kiểm tra coi có giá km ko
        var date1 = new Date(element.hankm)
        var date2 = new Date()
        if ((date1.getTime() >= date2.getTime()) && (element.giakm != "")) {
            element.gia = element.giakm;
        }

        tongtien += element.gia * element.soluongdat;
    })
    res.render('thanhtoangiohang', { chuyenmuc: chuyenmuc, name: username, giohang: giohang, tongtien: tongtien, find: find, role: "" });
}
//Xac nhan thanh toan gio hang
module.exports.xacnhanthanhtoangiohang = function (req, res, next) {
    var idgiohang = req.body.idgiohang;
    var username = req.cookies.info.username;
    var thanhtoan = req.body.thanhtoan;
    var chuyenmuc = db.get('Chuyenmuc').value();
    var giohang = db.get('GioHang').find({ idgiohang: idgiohang }).value();
    var find = db.get('Chuyenmuc').value();
    var tongtien = 0;
    var hang = [];
    giohang.mathang.forEach(element => {
        var hang_temp = {};
        hang_temp.ten = element.ten;
        hang_temp.id = element.id;
        hang_temp.soluongdat = element.soluongdat;

        // Kiểm tra coi có giá km ko
        var date1 = new Date(element.hankm)
        var date2 = new Date()
        if ((date1.getTime() >= date2.getTime()) && (element.giakm != "")) {
            tongtien += element.giakm * element.soluongdat;
            hang_temp.gia = element.giakm;
        } else {
            tongtien += element.gia * element.soluongdat;
            hang_temp.gia = element.gia;
        }
        hang.push(hang_temp);

    })

    var idhoadon = randomid();
    var magiaodich = randomid();


    // var thoigian = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear() + "-" + d.getHours() + "h" + d.getMinutes() + "p";
    var thoigian = d;
    // console.log("here");




    //Thêm thanh toán ở đây

    if (thanhtoan == 'vnpay') {
        //Qua trang sandbox VNPAY

        var ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        var config = require('config');
        var dateFormat = require('dateformat');


        var tmnCode = config.get('vnp_TmnCode');
        var secretKey = config.get('vnp_HashSecret');
        var vnpUrl = config.get('vnp_Url');
        var returnUrl = config.get('vnp_ReturnUrl');

        var date = new Date();

        var createDate = dateFormat(date, 'yyyymmddHHmmss');
        var orderId = dateFormat(date, 'HHmmss');
        //Thông tin cần cho thanh toán
        var amount = tongtien;  //Số tiền
        var bankCode = '';  //Mã thẻ

        var orderInfo = idhoadon; //Thông tin order
        var orderType = 'billpayment';  //Loại order
        var locale = 'vn';  //Ngôn ngữ
        if (locale === null || locale === '') {
            locale = 'vn';
        }
        var currCode = 'VND';
        var vnp_Params = {};
        vnp_Params['vnp_Version'] = '2';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        var querystring = require('qs');
        var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });

        var sha256 = require('sha256');

        var secureHash = sha256(signData);

        vnp_Params['vnp_SecureHashType'] = 'SHA256';
        vnp_Params['vnp_SecureHash'] = secureHash;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true });

        //Neu muon dung Redirect thi dong dong ben duoi
        // res.status(200).json({code: '00', data: vnpUrl})
        //Neu muon dung Redirect thi mo dong ben duoi va dong dong ben tren

        var donhang = { idhoadon: idhoadon, magiaodich: magiaodich, thanhtoan: thanhtoan, usr: username, hang: hang, thanhtien: tongtien, idgiohang: idgiohang, thoigian: thoigian, trangthai: 'chuathanhtoan' };
        db.get('HoaDon')
            .push(donhang)
            .write()

        res.redirect(vnpUrl)

    } else {
        var donhang = { idhoadon: idhoadon, magiaodich: magiaodich, thanhtoan: thanhtoan, usr: username, hang: hang, thanhtien: tongtien, idgiohang: idgiohang, thoigian: thoigian, trangthai: 'dathanhtoan' };
        db.get('HoaDon')
            .push(donhang)
            .write()

        // Sau khi hoàn thành thì empty cái giỏ hàng
        db.get('GioHang').find({ idgiohang: idgiohang }).assign({ mathang: [] }).write();

        var donhang = db.get('HoaDon').find({ idhoadon: idhoadon }).value();
        res.render('thongtinhoadon', { chuyenmuc: chuyenmuc, donhang: donhang, name: username, find: find, role: "" });
    }



}