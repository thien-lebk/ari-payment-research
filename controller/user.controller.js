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

//End of Import lowDB
//Date time
var d = new Date();

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

module.exports.index = function (req, res) {
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

    res.render('index', { title: 'Express', find: find, listsp: mathang, name: name, role:role});
}
module.exports.dangki = function (req, res) {
    var name;
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;
            giohang = db.get('MatHang').find({ username: name }).value();
        } else {
            name = "";
        }
    }
    else {
        name = "";

    }
    res.render('dangki', { title: 'Express', status: '', name: name , role:""});
}
module.exports.xacthucdangki = function (req, res) {
    var usr = req.body.usr;
    var pass = md5(req.body.pass);
    var giohang = randomid();
    var name;
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;

            giohang = db.get('MatHang').find({ username: name }).value();

        } else {
            name = "";

        }
    }
    else {
        name = "";

    }
    var find = db.get('User').find({ username: usr }).value();

    if (find) {
        res.render('dangki', { title: 'Express', status: 'Tai khoan da duoc dang ki' });


    } else {
        db.get('User')
            .push({ username: usr, password: pass, giohang: giohang })
            .write();
        db.get('GioHang')
            .push({ username: usr, idgiohang: giohang, mathang: [] })
            .write();

        res.render('dangnhap', { title: 'Express', status: 'Dang ki thanh cong', name: name, role:""});

    }
}
module.exports.dangnhap = function (req, res, next) {
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;

            giohang = db.get('MatHang').find({ username: name }).value();

        } else {
            name = "";

        }
    }
    else {
        name = "";

    }
    res.render('dangnhap', { title: 'Express', status: '', name: name, role:"" });
}

//Them chuyen muc GET
module.exports.themchuyenmuc = function (req, res, next) {
    var name = req.cookies.info.username;

    var dsChuyenMuc = db.get('Chuyenmuc').value();

    var role = "";
    if( req.cookies.info.role){
        role = req.cookies.info.role;
        res.render('themchuyenmuc', { title: 'Thêm chuyên mục', status: '', name: name,role:role , dsChuyenMuc});
    } else {
        res.redirect('/');
    }
}
//Them chuyen muc POST
module.exports.postthemchuyenmuc = function (req, res, next) {
    var ten = req.body.ten;
    var url = req.body.url;
    var id = randomid();

    db.get('Chuyenmuc')
        .push({ ten: ten, id: id, url: url })
        .write()
    var find = db.get('Chuyenmuc').value();

    var name = req.cookies.info.username;

    var dsChuyenMuc = db.get('Chuyenmuc').value();

    var role = "";
    if( req.cookies.info.role){
        role = req.cookies.info.role;
        res.render('themchuyenmuc', { title: 'Thêm chuyên mục', status: '', name: name,role:role , dsChuyenMuc});
    } else {
        res.redirect('/');
    }
}
//Them mat hang GET
module.exports.themmathang = function (req, res, next) {
    var name = req.cookies.info.username;
    var role = "";
    
    if( req.cookies.info.role){
        role = req.cookies.info.role;
        var chuyenmuc = db.get('Chuyenmuc').value();
        res.render('themmathang', { title: "Them mat hang", chuyenmuc: chuyenmuc, name: name,role:role });
    } else {
        res.redirect('/');
    }
        
   

}
//Them mat hang POST
module.exports.postthemmathang = function (req, res, next) {
    var ten = req.body.ten;
    var mota = req.body.mota;
    var gia = req.body.gia;
    var anh = req.body.anh;
    var soluong = req.body.soluong;
    var chuyenmuc = req.body.chuyenmuc;
    var giakm = req.body.giakm;
    var hankm = req.body.hankm;
    var id = random.int(min = 0, max = 999999).toString();

    db.get('MatHang')
        .push({ ten: ten, id: id, mota: mota, gia: gia, anh: anh, soluong: soluong, chuyenmuc: chuyenmuc , giakm: giakm, hankm: hankm})
        .write()
    var find = db.get('Chuyenmuc').value();
    res.redirect('/');

}
//Chi tiet mat hang
//Them mat hang POST
module.exports.chitietmathang = function (req, res, next) {
    var name = req.cookies.info.username;
    var role = "";

    if(req.cookies.info.role){
        role = req.cookies.info.role;
    }
    var id = req.body.id;

    var mathang = db.get('MatHang').find({ id: id }).value();
    var chuyenmuc = db.get('Chuyenmuc').value();

    res.render('chitietmathang', { chuyenmuc: chuyenmuc, mathang: mathang, name: name ,role:role});

}

//Thanh toan
//POST trang thanh toan
module.exports.thanhtoan = function (req, res, next) {
    var name = req.cookies.info.username;
    var role = "";

    if(req.cookies.info.role){
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

    res.render('thanhtoan', { chuyenmuc: chuyenmuc, mathang: mathang, name: name, find: find,role:role});

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

    if(req.cookies.info.role){
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
    
    res.render('hoadon', { chuyenmuc: chuyenmuc, mathang: mathang, donhang: donhang, name: usr ,soluongdat:soluongdat, find: find,role:role});
}
//POST xac nhan thanh toan
module.exports.xacnhanthanhtoan = function (req, res, next) {
    var thanhtoan = req.body.thanhtoan;
    var id = req.body.id;
    var idhoadon = randomid();
    var magiaodich = randomid();
    var usr = req.cookies.info.username;
    if(thanhtoan=='vnpay'){
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
        var amount = req.body.thanhtien;;  //Số tiền
        var bankCode = '';  //Mã thẻ
        
        var orderInfo = idhoadon; //Thông tin order
        var orderType = 'billpayment';  //Loại order
        var locale = 'vn';  //Ngôn ngữ
        if(locale === null || locale === ''){
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
        vnp_Params['vnp_Amount'] = amount*100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if(bankCode !== null && bankCode !== ''){
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        var querystring = require('qs');
        var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });

        var sha256 = require('sha256');

        var secureHash = sha256(signData);

        vnp_Params['vnp_SecureHashType'] =  'SHA256';
        vnp_Params['vnp_SecureHash'] = secureHash;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true });

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
        }else{
            gia = mathang.gia
        }

        var chuyenmuc = db.get('Chuyenmuc').value();

        var donhang = { idhoadon: idhoadon, magiaodich: magiaodich, thanhtoan: thanhtoan, usr: usr, hang: [{ ten: mathang.ten, gia: gia, id: id, soluongdat: soluongdat }], thanhtien: thanhtien, idgiohang: 0, thoigian: thoigian, trangthai:'chuathanhtoan' };
        db.get('HoaDon')
            .push(donhang)
            .write()

        //end;
        
        res.redirect(vnpUrl)
        //End qua trang sandbox
    } else if (thanhtoan== "ether"){
        console.log("Thanh toan bang ether ========================================================");

        var user_address = req.body.user_address;
        var privateKey = '0x' + req.body.private_key;
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
        }else{
            gia = mathang.gia
        }

        var chuyenmuc = db.get('Chuyenmuc').value();

        // Implement web3
        // Connecting to web3 + Initiating web3
        var jsonInterface = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getOrderHistory","outputs":[{"components":[{"internalType":"uint256","name":"token","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint8","name":"quantity","type":"uint8"},{"internalType":"uint256","name":"price_in_wei","type":"uint256"}],"internalType":"struct BookStoreInit.order[]","name":"","type":"tuple[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"_from","type":"address"},{"internalType":"uint256","name":"_token","type":"uint256"},{"internalType":"uint8","name":"_quantity","type":"uint8"}],"name":"implementTransaction","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"incognitoAddress","outputs":[{"internalType":"address payable","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address payable","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address payable","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
        var url = 'https://rinkeby.infura.io/v3/95b9bf5b38fb4b9d939b3ae99cfa8386'
        var Web3 = require('web3')
        var web3 = new Web3(new Web3.providers.HttpProvider(url));
        var Contract = require('web3-eth-contract');
        // set provider for all later instances to use
        Contract.setProvider('https://rinkeby.infura.io/v3/95b9bf5b38fb4b9d939b3ae99cfa8386');
        var contract = new Contract(jsonInterface, '0x30d9072A565be8C25580e442C872aF6421b26cD8');
        // console.log(contract.address);
        // var mykey = 'M9DwimppdGNFUtBx';
        // var mysecret = '3c0HE9A3BeESypJukasqyTGQUEi9VF8v';
        // var Client = require('coinbase').Client;
        // var client = new Client({'apiKey': mykey, 'apiSecret': mysecret});

        // client.getBuyPrice({'currencyPair': 'BTC-USD'}, function(err, obj) {
        //     console.log('total amount: ' + obj);
        // });

        

        // Test function
        web3.eth.getBalance(user_address).then(console.log);
        web3.eth.getGasPrice().then(console.log)
        
        var id_sanpham = req.body.id;
        
        contract.methods.getOrderHistory(user_address).call().then(console.log).catch(function () {console.log("Promise Rejected");});;

        var nonce =  web3.eth.getTransactionCount(user_address);
        // var nonceHex
        var transaction = contract.methods.implementTransaction(user_address, id_sanpham, soluongdat);
        var encodeABI = transaction.encodeABI();
        var tx = {
            from: user_address,
            to: '0x30d9072A565be8C25580e442C872aF6421b26cD8',
            value: web3.utils.toWei(thanhtien, "ether"),
            gas: 2000000,
            data: encodeABI,
            chainId: 4,
            // nonce: 5
        }; 
        
        // const privateKey = Buffer.from('6B4C896CAEB9839A433F0BADBBB2FA28D7B2691E268DFD577C55D9B6D606EC7D', 'hex')


        web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
            var tran = web3.eth.sendSignedTransaction(signed.rawTransaction);
            
            // tran.on('confirmation', (confirmationNumber, receipt) => {
            //   console.log('confirmation: ' + confirmationNumber);
            // });
        
            tran.on('transactionHash', hash => {
              console.log('hash');
              console.log(hash);
            });
        
            tran.on('receipt', receipt => {
              console.log('receipt');
              console.log(receipt);
              console.log("This come second")

            
              //IN HOÁ ĐƠN Ở ĐÂY
              var idhoadon = randomid();

              var donhang = { idhoadon: idhoadon, magiaodich: receipt.transactionHash, thanhtoan: thanhtoan, usr: usr, hang: [{ ten: mathang.ten, gia: gia, id: id, soluongdat: soluongdat }], thanhtien: thanhtien, idgiohang: 0, thoigian: thoigian, trangthai:'dathanhtoan' };
              db.get('HoaDon')
                  .push(donhang)
                  .write()
      
              var name = req.cookies.info.username;
              var role = "";
      
              if(req.cookies.info.role){
                  role = req.cookies.info.role;
              }
              res.render('thongtinhoadon', { chuyenmuc: chuyenmuc, mathang: mathang, donhang: donhang, name: name,role:role , find: find});
              /////////////////////////////////////////

            });
        
            tran.on('error', console.error);
        });

        

    } else{

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
        }else{
            gia = mathang.gia
        }

        var chuyenmuc = db.get('Chuyenmuc').value();

        var donhang = { idhoadon: idhoadon, magiaodich: magiaodich, thanhtoan: thanhtoan, usr: usr, hang: [{ ten: mathang.ten, gia: gia, id: id, soluongdat: soluongdat }], thanhtien: thanhtien, idgiohang: 0, thoigian: thoigian, trangthai:'dathanhtoan' };
        db.get('HoaDon')
            .push(donhang)
            .write()

        var name = req.cookies.info.username;
        var role = "";

        if(req.cookies.info.role){
            role = req.cookies.info.role;
        }
        res.render('thongtinhoadon', { chuyenmuc: chuyenmuc, mathang: mathang, donhang: donhang, name: name,role:role , find: find});
    }
}

//GET Lich su giao dich
module.exports.lichsudathang = function (req, res, next) {

    var usr = req.cookies.info.username;
    var role ;
    if(req.cookies.info.username){
        role = req.cookies.info.role;
    }
    
    var chuyenmuc = db.get('Chuyenmuc').value();
    var hoadon = db.get('HoaDon')
        .value()
    var danhsach = []
    hoadon.forEach(element => {
        if (element.usr == usr &&element.trangthai == 'dathanhtoan') {
            danhsach.push(element);
        }
    });
    console.log("role la "+ role);
    
    res.render('lichsudathang', { hoadon: danhsach, name: usr,role:role });
}

//GET Đơn hàng chưa thanh toán
module.exports.donhangchuathanhtoan = function (req, res, next) {

    var usr = req.cookies.info.username;
    var role ;
    if(req.cookies.info.username){
        role = req.cookies.info.role;
    }
    
    var chuyenmuc = db.get('Chuyenmuc').value();
    var hoadon = db.get('HoaDon')
        .value()
    var danhsach = []
    hoadon.forEach(element => {
        if (element.usr == usr &&element.trangthai == 'chuathanhtoan') {
            danhsach.push(element);
        }
    });
    console.log("role la "+ role);
    
    res.render('donhangchuathanhtoan', { hoadon: danhsach, name: usr,role:role });
}

//Post Đơn hàng chưa thanh toán
module.exports.postdonhangchuathanhtoan = function (req, res, next) {
    var name = req.cookies.info.username;
    var idhoadon = req.body.idhoadon;

   var hoadon =  db.get("HoaDon").find({ idhoadon: idhoadon }).value();
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
if(locale === null || locale === ''){
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
vnp_Params['vnp_Amount'] = amount*100;
vnp_Params['vnp_ReturnUrl'] = returnUrl;
vnp_Params['vnp_IpAddr'] = ipAddr;
vnp_Params['vnp_CreateDate'] = createDate;
if(bankCode !== null && bankCode !== ''){
    vnp_Params['vnp_BankCode'] = bankCode;
}

vnp_Params = sortObject(vnp_Params);

var querystring = require('qs');
var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });

var sha256 = require('sha256');

var secureHash = sha256(signData);

vnp_Params['vnp_SecureHashType'] =  'SHA256';
vnp_Params['vnp_SecureHash'] = secureHash;
vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true });
res.redirect(vnpUrl)
}

//Post Chi tiet lich su don hang
module.exports.chitietlichsudonhang = function (req, res, next) {
    var name = req.cookies.info.username;

    var idhoadon = req.body.idhoadon;
    var role = "";

    if(req.cookies.info.role){
        role = req.cookies.info.role;
    }
    var donhang = db.get('HoaDon')
        .find({ idhoadon: idhoadon })
        .value();

    res.render('chitietlichsudonhang', { donhang: donhang, name: name,role:role });
}
//Logout
module.exports.logout = function (req, res, next) {
    //    res.cookie('info',{'username':usr, 'password':pass});

    res.cookie('info', { expires: Date.now() });
    res.redirect('/');
}

//Them gio hang
module.exports.themgiohang = function (req, res, next) {
    //    res.cookie('info',{'username':usr, 'password':pass});
    var usr = req.cookies.info.username;
    var idhang = req.body.id;
    var hang = db.get('MatHang').find({ id: idhang }).value();
    var giohang = db.get("User").find({ username: usr }).value().giohang;
    var mathang = db.get("GioHang").find({ idgiohang: giohang }).value().mathang;
    // Sửa chỗ số lượng này
    hang["soluongdat"] = 1;
    console.log(hang);

    if (!(mathang.filter(str => str.id == idhang)[0])) {
        mathang.push(hang);
        db.get("GioHang").find({ idgiohang: giohang }).assign({ mathang }).write();
    }
    res.redirect('/');
}
//Xem gio hang
module.exports.giohang = function (req, res, next) {
    var username = req.cookies.info.username;
    var role = "";

    if(req.cookies.info.role){
        role = req.cookies.info.role;
    }
  
    var chuyenmuc = db.get('Chuyenmuc').value();
    var giohang = db.get('GioHang').find({ username: username }).value();
    res.render('giohang', { chuyenmuc: chuyenmuc, name: username, giohang: giohang ,role:role});
}

//Xoa san pham khoi gio
module.exports.xoasanphamkhoigio = function (req, res, next) {
    var username = req.cookies.info.username;
    var idsanpham = req.body.id;
    var chuyenmuc = db.get('Chuyenmuc').value();
    var giohang = db.get('GioHang').find({ username: username }).value();
    var mathang = [];
    if(req.cookies.info.role){
        role = req.cookies.info.role;
    }
    giohang.mathang.forEach(element => {
        if (element.id != idsanpham) {
            mathang.push(element);
        }
    });
    db.get("GioHang").find({ username: username }).assign({ mathang }).write();
    giohang = db.get('GioHang').find({ username: username }).value();
    res.render('giohang', { chuyenmuc: chuyenmuc, name: username, giohang: giohang,role:role });
}
//AJAX cap nhat gio hang
module.exports.capnhatgiohang = function (req, res, next) {
    var idgiohang = req.body.idgiohang;
    var idmathang = req.body.idmathang;
    var soluongdat = req.body.soluong;
    var giohang = db.get('GioHang').find({ idgiohang: idgiohang }).value();
    
    giohang.mathang.forEach(element => {
        if (element.id == idmathang) {

            element.soluongdat = soluongdat;
        }
    });
    var mathang = giohang.mathang;    
    db.get("GioHang").find({ idgiohang: idgiohang }).assign({ mathang }).write();

    res.send();
}
//Thanh toan gio hang
module.exports.thanhtoangiohang = function (req, res, next) {
    var idgiohang = req.body.idgiohang;
    var username = req.cookies.info.username;
    var chuyenmuc = db.get('Chuyenmuc').value();
    var giohang = db.get('GioHang').find({ idgiohang: idgiohang }).cloneDeep().value();
    var find = db.get('Chuyenmuc').value();
    var tongtien = 0;
    giohang.mathang.forEach(element=>{
        // Kiểm tra coi có giá km ko
        var date1 = new Date(element.hankm)
        var date2 = new Date()
        if ((date1.getTime() >= date2.getTime()) && (element.giakm != "")) { 
            element.gia = element.giakm;
        }

        tongtien += element.gia*element.soluongdat;
    })
    res.render('thanhtoangiohang', { chuyenmuc: chuyenmuc, name: username, giohang: giohang, tongtien:tongtien, find: find,role:"" });
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
    giohang.mathang.forEach(element=>{
        var hang_temp = {};
        hang_temp.ten = element.ten;
        hang_temp.id = element.id;
        hang_temp.soluongdat = element.soluongdat;

        // Kiểm tra coi có giá km ko
        var date1 = new Date(element.hankm)
        var date2 = new Date()
        if ((date1.getTime() >= date2.getTime()) && (element.giakm != "")) { 
            tongtien += element.giakm*element.soluongdat;
            hang_temp.gia = element.giakm;
        }else{
            tongtien += element.gia*element.soluongdat;
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

if(thanhtoan == 'vnpay'){
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
if(locale === null || locale === ''){
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
vnp_Params['vnp_Amount'] = amount*100;
vnp_Params['vnp_ReturnUrl'] = returnUrl;
vnp_Params['vnp_IpAddr'] = ipAddr;
vnp_Params['vnp_CreateDate'] = createDate;
if(bankCode !== null && bankCode !== ''){
 vnp_Params['vnp_BankCode'] = bankCode;
}

vnp_Params = sortObject(vnp_Params);

var querystring = require('qs');
var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });

var sha256 = require('sha256');

var secureHash = sha256(signData);

vnp_Params['vnp_SecureHashType'] =  'SHA256';
vnp_Params['vnp_SecureHash'] = secureHash;
vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true });

//Neu muon dung Redirect thi dong dong ben duoi
// res.status(200).json({code: '00', data: vnpUrl})
//Neu muon dung Redirect thi mo dong ben duoi va dong dong ben tren

var donhang = { idhoadon: idhoadon, magiaodich: magiaodich, thanhtoan: thanhtoan, usr: username, hang: hang, thanhtien: tongtien, idgiohang: idgiohang, thoigian: thoigian, trangthai:'chuathanhtoan' };
    db.get('HoaDon')
        .push(donhang)
        .write()

        res.redirect(vnpUrl)

} else {
    var donhang = { idhoadon: idhoadon, magiaodich: magiaodich, thanhtoan: thanhtoan, usr: username, hang: hang, thanhtien: tongtien, idgiohang: idgiohang, thoigian: thoigian, trangthai:'dathanhtoan' };
    db.get('HoaDon')
        .push(donhang)
        .write()

    // Sau khi hoàn thành thì empty cái giỏ hàng
    db.get('GioHang').find({ idgiohang: idgiohang }).assign({mathang: []}).write();

    var donhang = db.get('HoaDon').find({ idhoadon: idhoadon }).value();
    res.render('thongtinhoadon', { chuyenmuc: chuyenmuc, donhang: donhang, name: username, find: find,role:""});
}



}

//Thêm người dùng
module.exports.themnguoidung = function (req, res, next) {
    var role = "";
    var name = ""

    if(req.cookies.info.role){
        role = req.cookies.info.role;
    }
    if(req.cookies.info.username){
        name = req.cookies.info.username;
    }
    res.render('themnguoidung', {  name:name, username:name,role:role,title:"Thêm người dùng",status:"" });
}
module.exports.postthemnguoidung = function (req, res, next) {
    var usr = req.body.usr;
    var pass = md5(req.body.pass);
    var giohang = randomid();
    var role = req.body.role;
    var name;
  
   
    var find = db.get('User').find({ username: usr }).value();

    if (find) {
        res.render('themnguoidung', { title: 'Express', status: 'Tai khoan da duoc dang ki' });


    } else {
        
        if(role == "admin"){
            db.get('User')
            .push({ username: usr, password: pass, giohang: giohang,role:"admin" })
            .write();
        } else{
            db.get('User')
            .push({ username: usr, password: pass, giohang: giohang })
            .write();
        }
        


        db.get('GioHang')
            .push({ username: usr, idgiohang: giohang, mathang: [] })
            .write();

        res.render('dangnhap', { title: 'Express', status: 'Dang ki thanh cong', name: name, role:""});

    }
}






///////////////////////// TIN //////////////////////////////
module.exports.xemtheodanhmuc = function(req, res, next){

    var name;
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;
            role = req.cookies.info.role;
        } else {
            name = "";

        }
    }
    else {
        name = "";

    }

    var dsSanpham = db.get("MatHang").filter({chuyenmuc: req.params.tendanhmuc}).value();
    var find = db.get('Chuyenmuc').value();
    // console.log(dsSanpham);
    // console.log("Params la gi: ", req.params);
    res.render('xemtheodanhmuc', {name: name, listsp: dsSanpham, find: find,role:role});

}

// 
module.exports.chinhsuamathang = function(req, res, next){

    var name;
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;
        } else {
            name = "";
        }
    }
    else {
        name = "";
    }
    //console.log("Triggered!");
    var sanpham = db.get("MatHang").filter({id: req.params.id}).value()[0];
    console.log(sanpham);

    var chuyenmuc = db.get('Chuyenmuc').value();
    var role = "";

    if(req.cookies.info.role){
        role = req.cookies.info.role;
    }
    res.render('chinhsuamathang', {title: "Triggered :v", sanpham: sanpham, chuyenmuc: chuyenmuc, name: name, role:role});
}

module.exports.postchinhsuamathang = function(req, res, next){
    // console.log("Triggered!");
    db.get("MatHang").find({id: req.params.id}).assign({ten: req.body.ten, mota: req.body.mota, gia: req.body.gia, anh: req.body.anh, soluong: req.body.soluong, chuyenmuc: req.body.chuyenmuc, giakm: req.body.giakm, hankm: req.body.hankm}).write();

    // Update xong thì trở về trang danh mục sản phẩm
    var name;
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;
        } else {
            name = "";
        }
    }
    else {
        name = "";
    }
    var dsSanpham = db.get("MatHang").filter({chuyenmuc: req.body.chuyenmuc}).value();
    var find = db.get('Chuyenmuc').value();
    // console.log(dsSanpham);
    // console.log("Params la gi: ", req.params);
    var role = "";

    if(req.cookies.info.role){
        role = req.cookies.info.role;
    }
    // res.render('xemtheodanhmuc', {name: name, listsp: dsSanpham, find: find, role:role});
    res.redirect('/');
}

module.exports.xoasanpham = function(req, res, next){
    console.log("Triggered!");
    var chuyenmuc = db.get("MatHang").find({id: req.params.id}).value().chuyenmuc;
    db.get("MatHang").remove({id: req.params.id}).write();

    // Xóa xong thì trở về trang danh mục sản phẩm
    var name;
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;
        } else {
            name = "";
        }
    }
    else {
        name = "";
    }
    var role = "";

    if(req.cookies.info.role){
        role = req.cookies.info.role;
    }
    var dsSanpham = db.get("MatHang").filter({chuyenmuc: chuyenmuc}).value();
    var find = db.get('Chuyenmuc').value();
    res.render('xemtheodanhmuc', {name: name, listsp: dsSanpham, find: find, role:role});
}

module.exports.search = function(req, res, next){

    var name;
    if (req.cookies.info) {
        if (req.cookies.info.username) {
            name = req.cookies.info.username;
            role = req.cookies.info.role;
        } else {
            name = "";

        }
    }
    else {
        name = "";

    }


    var find = db.get('Chuyenmuc').value();

    var query = req.query.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D")

    var dsSanpham = db.get("MatHang").value();
    //console.log(dsSanpham);
    var re = new RegExp(query,"i");
    dsSanpham = dsSanpham.filter((element)=>{
        var tempName = element.ten.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
        return tempName.search(re) != -1;
    })

    //console.log(dsSanpham);

    res.render('search', {name: name, listsp: dsSanpham, find: find,role: role, query: req.query.name});
}

//Xoá chuyen muc POST
module.exports.xoachuyenmuc = function (req, res, next) {
    var ten = req.body.ten;

    db.get('Chuyenmuc')
        .remove({ ten: ten })
        .write()

    db.get('MatHang').remove({chuyenmuc: ten}).write();
    // var name = req.cookies.info.username;

    // var dsChuyenMuc = db.get('Chuyenmuc').value();

    // var role = "";
    // if( req.cookies.info.role){
    //     role = req.cookies.info.role;
    //     res.render('themchuyenmuc', { title: 'Thêm chuyên mục', status: '', name: name,role:role , dsChuyenMuc});
    // } else {
    //     res.redirect('/');
    // }
    res.redirect('/themchuyenmuc')
}


//Sửa chuyen muc POST
module.exports.suachuyenmuc = function (req, res, next) {
    var ten = req.body.new_ten;

    // db.get('Chuyenmuc')
    //     .remove({ ten })
    //     .write()
    // var find = db.get('Chuyenmuc').value();

    
    while(db.get('MatHang').find({chuyenmuc: req.body.old_ten}).value()){
        db.get('MatHang')
            .find({ chuyenmuc: req.body.old_ten })
            .assign({ chuyenmuc: req.body.new_ten})
            .write()           
    }
    db.get('Chuyenmuc').find({ten: req.body.old_ten}).assign({ten: req.body.new_ten}).write();

    console.log("-------------------------------clicked update button!!!!!!!")

    res.redirect('/themchuyenmuc');
}