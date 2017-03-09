var express = require( 'express' );
var router  = express.Router();

var Branch          = require('../models/branch');
var CartridgeStore  = require('../models/cartridge-store');

// Создание Хранилища Картриджей
router.post( '/add', function ( req, res ) {

  Branch.findById(req.body.branchId, function (err, branch) {

    // В случае возникновения ошибки
    if ( err ) {
      return res.status( 500 ).json({
        title:  'При поиске <- Филиала -> возникла ошибка',
        error:  err
      });
    }
    // В случае положительного ответа
    // Проверяем нет ли уже Хранилища Картриджей привязанного к этому Филиалу
    if ( branch.cartridge_store != null ) {
      return res.status( 500 ).json({
        title:  'В <- Филиале -> уже есть <- Хранилище Картриджей ->',
        error:  err
      });
    }
    // Cобираем объект Хранилища Картриджей по модели
    var cartridge_store = new CartridgeStore({
      branch:           branch._id,
      stock:            []
    });

    // Пытаемся сохранить объект в БД
    cartridge_store.save( function ( err, result_store ) {

      // В случае возникновения ошибки
      if ( err ) {
        return res.status( 500 ).json({
          title:  'При создании <- Хранилища Картриджей -> возникла ошибка',
          error:  err
        });
      }
      // В случае положительного ответа
      // Связь Хранилища Картриджей с Филиалом
      Branch.findByIdAndUpdate( branch._id, { $set: { cartridge_store: result_store._id }}, { new: true }, function ( err, result_branch ) {
        if ( err ) {
          return res.status( 500 ).json({
            title:  'При добавлении <- Хранилища Картриджей ->  в <- Филиал -> возникла ошибка',
            error:  err
          });
        }
        res.status( 201 ).json({
          message:  '<- Хранилище Картриджей -> успешно добавлено в <- Филиал ->',
          obj:      result_branch
        });

      });
      // res.status( 201 ).json({
      //   message:  '<- Хранилище Картриджей -> успешно создано',
      //   obj:      result_store
      // });
    });
  });


});

// Получение списка Хранилищ Картриджей
router.get('/get', function (req, res) {
  CartridgeStore.find(function (err, cartridge_stores) {
    if (err) {
      return res.status(500).json({
        title: 'При получении списка <- Хранилищ Картриджей -> возникла ошибка',
        error: err
      });
    }
    if (!cartridge_stores) {
      return res.status(404).json({
        title: 'Данные <- Хранилища Картриджей -> не найдены',
        error: err
      });
    }
    res.status(200).json({
      message: '<- Хранилища Картриджей -> получены',
      obj: cartridge_stores
    });
  });
});

// Получение данных Хранилища Картриджей по ID
router.get('/get/:id', function (req, res) {
  CartridgeStore.findById(req.params.id, function (err, cartridge_store) {
    if (err) {
      return res.status(500).json({
        title: 'При получении данных <- Хранилища Картриджей -> возникла ошибка',
        error: err
      });
    }
    if (!cartridge_store) {
      return res.status(404).json({
        title: 'Данные <- Хранилища Картриджей -> не найдены',
        error: err
      });
    }
    res.status(200).json({
      message: 'Данные <- Хранилища Картриджей -> получены',
      obj: cartridge_store
    });
  });
});

// Удаление Хранилища Картриджей
router.delete('/:id', function (req, res) {
  CartridgeStore.findById(req.params.id, function (err, cartridge_store) {
    if ( err ) {
      return res.status(500).json({
        title: 'При удалении <- Хранилища Картриджей -> возникла ошибка.',
        error: err
      });
    }
    if ( !cartridge_store ) {
      return res.status(404).json({
        title: 'Данные <- Хранилища Картриджей -> не найдены',
        error: err
      });
    }
    cartridge_store.remove( function ( err, result ) {
      if ( err ) {
        return res.status(404).json({
          title: 'Данные <- Хранилища Картриджей -> не найдены',
          error: err
        });
      }
      res.status(201).json({
        title: '<- Хранилище Картриджей -> успешно удалено',
        obj: result
      });
    });
  });
});


module.exports = router;