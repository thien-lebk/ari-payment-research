var express = require('express');
var router = express.Router();
var controller = require('../controller/user.controller') //import controller
//Import auth.middleware
var auth = require('../controller/auth.middleware');

//Random id
var randomid = require('randomid')
//Get from ajax
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })




//Import lowDB
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync');
const { log } = require('debug');
const adapter = new FileSync('db.json')
const db = low(adapter)

//End of Import lowDB

/* GET home page. */
router.get('/', controller.index);
/* GET Dang ki page. */
router.get('/dangki', controller.dangki);
/* POST home page. */
router.post('/post', controller.xacthucdangki);
// //Parameter
// router.get('/search', function (req, rest) {
//   var q = req.query.q;
//   var matchUser = user.filter(function (user) {
//     return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
//   })
//   console.log("success");

// })
// //Cookie
// router.get('/cookie', function (req, res, next) {
//   console.log(req.cookies.info);
//   res.send();
// });

//Login
router.get('/dangnhap', controller.dangnhap);
//Xac thuc dang nhap
router.post('/xacthucdangnhap', auth.xacthucdangnhap);
//Them chuyen muc
router.get('/themchuyenmuc', auth.authen, controller.themchuyenmuc);
router.post('/themchuyenmuc', auth.authen, controller.postthemchuyenmuc);

//Them mat hang
router.get('/themmathang', auth.authen, controller.themmathang);
router.post('/themmathang', auth.authen, controller.postthemmathang);
//Chi tiet mat hang
router.post('/chitietmathang', auth.authen, controller.chitietmathang);
//Thanh toan
router.post('/thanhtoan', auth.authen, controller.thanhtoan);
//Hoadon
router.post('/hoadon', auth.authen, controller.hoadon);
//Xac nhan thanh toan
router.post('/xacnhanthanhtoan', auth.authen, controller.xacnhanthanhtoan);
//Lich su giao dich
router.get('/lichsudathang', auth.authen, controller.lichsudathang);
//Chi tiet Lich su don hang
router.post('/chitietlichsudonhang', auth.authen, controller.chitietlichsudonhang);
//Đăng xuất
router.get('/logout', controller.logout);
//Thêm giỏ hàng
router.post('/themgiohang', controller.themgiohang);
//Xem gio hang
router.get('/giohang', auth.authen, controller.giohang);
//Post xoa san pham khoi gio hang
router.post('/xoasanphamkhoigio', auth.authen, controller.xoasanphamkhoigio);
//Cap nhat lai gio hang sau khi them san pham
router.post('/capnhatgiohang', jsonParser, controller.capnhatgiohang);
//Thanh toan gio hang
router.post('/thanhtoangiohang', auth.authen, controller.thanhtoangiohang);
//Thanh toan gio hang
router.post('/xacnhanthanhtoangiohang', auth.authen, controller.xacnhanthanhtoangiohang);

// Tới trang chỉnh sửa thông tin sản phẩm. theo id
router.get('/themnguoidung', auth.authen, controller.themnguoidung);
router.post('/themnguoidung', auth.authen, controller.postthemnguoidung);      


//Trang đơn hàng chưa thanh toán
router.get('/donhangchuathanhtoan', auth.authen, controller.donhangchuathanhtoan);
router.post('/donhangchuathanhtoan', auth.authen, controller.postdonhangchuathanhtoan);      
//Payment
router.get('/vnpay_return', function (req, res, next) {
    var vnp_Params = req.query;

    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    var config = require('config');
    var tmnCode = config.get('vnp_TmnCode');
    var secretKey = config.get('vnp_HashSecret');

    var querystring = require('qs');
    var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });

    var sha256 = require('sha256');

    var checkSum = sha256(signData);
    var idHoaDon = (vnp_Params.vnp_OrderInfo);
    var transNo = (vnp_Params.vnp_TransactionNo);
    if(transNo == 0){
        // res.render('error',{message: "Giao dịch thất bại"});
        var find = db.get('Chuyenmuc').value();
        var mathang = db.get('MatHang').value();
        var name = "";
        var role = "";
    
        if (req.cookies.info) {
            if (req.cookies.info.username) {
                name = req.cookies.info.username;
            } 
            if (req.cookies.info.role) {
                role = req.cookies.info.role;
            } 
        }
    
        res.render('thanhtoanthattbai', { title: 'Express', find: find, listsp: mathang, name: name, role:role, idhoadon:idHoaDon});
    }
    if(secureHash === checkSum){

        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

    //    var hoaDon = db.get("HoaDon").find({ idhoadon: idHoaDon }).value();

        
       // hoaDon.trangthai='dathanhtoan';
      //  console.log(hoaDon);
        //Luu thong tin vào db
         db.get("HoaDon").find({ idhoadon: idHoaDon }).assign({ trangthai:"dathanhtoan" }).write();

        //Get data đe render trang thongtinhoadon

         var name = req.cookies.info.username;
    var role = "";
    var chuyenmuc = db.get('Chuyenmuc').value();
   // var mathang = db.get('MatHang').find({ id: id }).value();
        var donhang = db.get('HoaDon').find({ idhoadon: idHoaDon }).value();
        console.log(donhang);
        //Xoa id gio hang
        // Sau khi hoàn thành thì empty cái giỏ hàng
    db.get('GioHang').find({ idgiohang: donhang.idgiohang }).assign({mathang: []}).write();


    if(req.cookies.info.role){
        role = req.cookies.info.role;
    }
         res.render('thongtinhoadon', { chuyenmuc: chuyenmuc,  donhang: donhang, name: name,role:role });

    } else{
        res.render('success', {code: '97'})
    }
});

router.get('/vnpay_ipn', function (req, res, next) {
    var vnp_Params = req.query;
    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    var config = require('config');
    var secretKey = config.get('vnp_HashSecret');
    var querystring = require('qs');
    var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });
    
    var sha256 = require('sha256');

    var checkSum = sha256(signData);

    if(secureHash === checkSum){
        var orderId = vnp_Params['vnp_TxnRef'];
        var rspCode = vnp_Params['vnp_ResponseCode'];
        //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
        res.status(200).json({RspCode: '00', Message: 'success'})
    }
    else {
        res.status(200).json({RspCode: '97', Message: 'Fail checksum'})
    }
});

function sortObject(o) {
    var sorted = {},
        key, a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}

module.exports = router;


////////////////////////// TINNNNNNNN //////////////////////////////
router.get('/danhmuc/:tendanhmuc', controller.xemtheodanhmuc);

// Tới trang chỉnh sửa thông tin sản phẩm. theo id
router.get('/chinhsua/:id', auth.authen, controller.chinhsuamathang);
router.post('/chinhsua/:id', auth.authen, controller.postchinhsuamathang);      // Xử lí form chỉnh sửa
router.post('/xoa/:id', auth.authen, controller.xoasanpham);      // Xử lí form chỉnh sửa
router.post('/suachuyenmuc', auth.authen, controller.suachuyenmuc);   
router.post('/xoachuyenmuc', auth.authen, controller.xoachuyenmuc);      

router.get('/search', controller.search);

module.exports = router;
