DatGuiUtil = {
  //superクラスのコンストラクタを実行
  initialize: function () {
    this.gui = new dat.GUI();
    this.update();
  },
  update: function () {
    console.log("update")
  }
};
