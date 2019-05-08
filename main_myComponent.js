


Vue.component('drop-filebutton', {
  template: `<div>
            <div id="divbtn_dmupfile" class="btn_defclass" v-bind:class="{dropover: isActive}" v-on:click="on_clickFileSelectBtn" v-on:dragover="on_dragover" v-on:dragleave="on_dragleave" v-on:drop="on_drop">{{val}}</div>
            <input type="file" id="dumpfile" v-on:change="on_changeFileName">
            <input type="text" id="dump_filename" v-bind:value="fname" placeholder="ファイルが選択されていません" readonly >
            </div>`,

  props: ['val'],
  data: function() { 
    return {
      fname: '',
      fileContent: '', //fileReaderで読み込んだ内容
      isActive: false  //クラスの表示切替
    };
  },
  methods: {
    on_clickFileSelectBtn: function() {
      document.querySelector('#dumpfile').click();
    },
    on_changeFileName: function(evt) {
      let file = evt.target.files;
      
      //inputテキストボックスへのファイル名表示
      this.fname = file[0].name;

      //FileReaderを作成してファイルの読み込み
      this.readFile_withFileReader(file[0]);
      
    },
    on_dragover: function(evt) {
      evt.preventDefault();
      evt.dataTransfer.dropEffect = "copy";
      this.isActive = true;
      console.log('on_dragover');
    },
    on_dragleave: function(evt){
      console.log('on_dragleave');
      this.isActive = false;
    },
    on_drop: function(evt) {
      evt.preventDefault();
      this.isActive = false;

      // evt.dataTransfer.filesはFileListオブジェクト
      const fileList = evt.dataTransfer.files;
    
      // Array.prototypeメソッドを使えるようにするため、FileListをArrayに変換する
      const fileArray = Array.from(fileList);
      
      //inputテキストボックスへのファイル名表示
      this.fname = fileArray[0].name;

      //FileReaderを作成してファイルの読み込み
      this.readFile_withFileReader(fileArray[0]);
    },
    //FileReaderの作成とファイルの読み込み
    readFile_withFileReader: function(fileObj) {
      
      let reader = new FileReader();
      reader.readAsText(fileObj);

      // readAsText() が終了後に呼び出される
      reader.onload = (evt) => {
        console.log('call reader onload');
        this.fileContent = evt.target.result;

        //ファイル読み込み完了を親に通知
        this.$emit('child_freaddone_evt');
      };
    }
  }
});


Vue.component('file-open1', {
  template: `<drop-filebutton v-on:child_freaddone_evt="fread_done" val='Dumpファイルを選択 or FileDrop'></drop-filebutton>`,
  
  methods:{
    doAction: function(){
      console.log('doAciotn');
    },
    fread_done: function(){
      console.log('fread_done');
      this.$emit('child_freaddone_evt2');
    }
  }
});

Vue.component('my-table', {
  template: `
  <table class="gen_tbl">
    <tr>
      <th v-for="elem in th_ary"> {{elem}} </th>
    </tr>
    
    <tr v-for="(td_ary, row_idx in td_ary_list" v-bind:class="{'value_error': isColor(row_idx)}">
      <td v-for="(elem, col_idx) in td_ary" v-if="btn_col.indexOf(col_idx) < 0">{{elem}}</td>
      <td v-else><button v-bind:class="['myTblBtn_' + row_idx]" v-on:click="on_btnClick">{{elem}}</button></td>
    </tr>
  </table>`,

  data: function() {
    return {
      /*
      th_ary: ['name', 'age', 'sex', 'hobby'],
      td_list:[
        ['久保田 耕司', 43, '男', 'パソコン'],
        ['久保田 寛子', 41, '女', '英会話'],
        ['久保田 有紀', 7, '女', '絵描き']
      ]
      */
      th_ary: null,
      td_ary_list: null,
      btn_col: [],
      color_row: []  //色を付ける行
    };
  },
  methods: {
    set_th: function(data){
      this.th_ary = data;
    },
    set_td: function(data){
      this.td_ary_list = data;
    },
    set_btn_col: function(num_ary) {
      this.btn_col = num_ary;
    },
    set_color_row: function(num_ary) {
      this.color_row = num_ary;
    },
    on_btnClick: function(evt) {
      console.log(evt);
      alert(`click btn ${evt.target.innerText} ${evt.srcElement.className}`);
    },
    isColor: function(idx) {
      return (this.color_row.indexOf(idx) >= 0);
    }
  },
  

});

Vue.config.devtools = true;

let app = new Vue({
  el: '#app',
  data: {
    message: 'Hello World',
    isActiveBtnAnalize: false,
    view_state: 'start'  //start, result_summary, 
  },
  methods: {
    on_clickStart: function(){
      console.log('on_clickStart');
      this.$refs.ref_filebox.doAction();
      //this.view_state = 'result_summary';
    },
    file_read_done: function() {
      this.isActiveBtnAnalize = true;
    },
    //test用ボタン
    btn_click_func: function(){
      this.$refs.ref_tbl1.set_btn_col([3]); //3列目をボタン表示にする
      this.$refs.ref_tbl1.set_color_row([1]); //tdの1行目(0start)に色を付ける
      this.$refs.ref_tbl1.set_th(['name', 'age', 'sex', 'hobby']);
      
      this.$refs.ref_tbl1.set_td([
        ['山田　太郎', 43, '男', 'パソコン'],
        ['山田　花子1', 41, '女', '英会話'],
        ['山田　花子2', 7, '女', '絵描き']
      ]);
      
    }
   
  }
});

