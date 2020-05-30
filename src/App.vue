<template>
<div id="appIndex" style="height: 100%;">
	<div class="top">
		<p>词条工具</p>
	</div>
	<el-header style="text-align: left; font-size: 12px; height: 60px">

		<div>
			<el-autocomplete placeholder="请输入词条" v-model="searchInput" style="width: 50%" :fetch-suggestions="querySearch" @select="handleSelect" prefix-icon="el-icon-search" @keyup.enter.native="buttonSearchClick" clearable/>
			&nbsp;

			<el-button type="primary" style="width:10%;" @click.native.prevent="buttonSearchClick">
				搜索
			</el-button>
			&nbsp;&nbsp;&nbsp;
			<el-link type="primary" href="javascript:void(0);" @click.native.prevent="linkClick">清除搜索历史</el-link>&nbsp;&nbsp;&nbsp;
			<el-link type="primary"  href="/words/word/downloadFile">下载数据文件</el-link>&nbsp;&nbsp;&nbsp;
			<el-link type="danger" id="topEditWord" disabled="" @click.native="dialogFormWord(searchInput)"></el-link>
		</div>
	</el-header>


	<el-container class="containerMain">

		<el-aside width="230px" style="background-color: rgb(238, 241, 246);">
			<el-menu class="menuLeft">
				<el-menu-item   v-for="i in leftList" ><el-link type="primary" @click.native="clickLeftLink(i)">{{i}}</el-link></el-menu-item>
			</el-menu>
			<div>
				<p>&nbsp;<el-input v-model="leftInputStart" placeholder="开始" size="mini" style="width:60px"></el-input> 至
					<el-input v-model="leftInputEnd" placeholder="结束" size="mini" style="width:60px"></el-input>
					<el-button size="mini" @click.native="dialogFormRelation(scope.row)">确定</el-button>
				</p>

			</div>

		</el-aside>

		<el-main style="margin:0;padding:0;">
			<el-table :data="tableData" border style="width: 100%" height="100vh">

				<el-table-column prop="id" label="序号" width="80"></el-table-column>
				<el-table-column prop="name" label="相关词条" style="width:50%"></el-table-column>

				<el-table-column prop="relation" label="关系" width="100">
				</el-table-column>
				<el-table-column label="操作">
					<template scope="scope">
						<el-button size="mini" @click.native="dialogFormRelation(scope.row)">编辑关系</el-button>
						<el-button size="mini" @click.native="dialogFormWord(scope.row.name)">编辑词条</el-button>
						<el-button size="mini" @click.native="searchWord(scope.row.name)">搜索词条</el-button>
					</template>
				</el-table-column>

			</el-table>
		</el-main>
	</el-container>

	<!--编辑关系对话窗-->
	<el-dialog width="600px" :title="dialogFormTitle" :visible.sync="dialogFormRelationVisible">
				<el-radio v-model="radioRelation" label="同义词" border>同义词</el-radio>
				<el-radio v-model="radioRelation" label="上位" border>上位</el-radio>
				<el-radio v-model="radioRelation" label="下位" border>下位</el-radio>&nbsp;&nbsp;&nbsp;
				<el-button type="primary" icon="el-icon-delete" @click="clearRadio1" size="medium">清除</el-button>
		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormRelationVisible = false">取 消</el-button>
			<el-button type="primary" @click="submitRelation">确 定</el-button>
		</div>
	</el-dialog>
	<!--编辑词条对话窗-->
	<el-dialog width="600px" :title="'词条 “'+editWord+'”'" :visible.sync="dialogFormWordVisible">
		<el-form :model="dialogFormWordData">
			<el-form-item label="同义词：" :label-width="formLabelWidth">
				<el-input  v-model="dialogFormWordData.synonyms" type="textarea" :rows=2 :placeholder=wordTips></el-input>
			</el-form-item>
			<el-form-item label="上位：" :label-width="formLabelWidth">
				<el-input  v-model="dialogFormWordData.uppers" type="textarea" :rows=2 :placeholder=wordTips></el-input>
			</el-form-item>
			<el-form-item label="下位：" :label-width="formLabelWidth">
				<el-input  v-model="dialogFormWordData.downs" type="textarea" :rows=2 :placeholder=wordTips></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormWordVisible = false">取 消</el-button>
			<el-button type="primary" @click="submitWord">确 定</el-button>
		</div>
	</el-dialog>

</div>
</template>
<script>


export default {


	data () {
		return {
			wordTips:'用英文逗号分隔词条'
			,leftList : ["第一线","第二项"]
			,searchInput: ''
			,tableData: []
			,relationOptions:[
				{value:'同义词'},{value:'上位'},{value:'下位'},{value:'无关'}
			]
			,dialogFormRelationVisible:false
			,dialogFormWordVisible:false
			,dialogFormWordData:{
                name:''
			    ,synonyms:''
                ,uppers:''
				,downs:''
			}
			,dialogFormTitle:''
            ,editWord: '' //点击编辑的词条
            ,formLabelWidth: '70px'
			,radioRelation:''//关系弹窗选中的文字
			,leftInputStart:'1'
			,leftInputEnd:'1000'
		}
	}
	,methods : {
		buttonSearchClick () {
            document.getElementById("topEditWord").innerHTML = '暂无词条“'+this.searchInput +"”";
            this.axios.get('/words/search?query='+encodeURI(this.searchInput))
                .then(res => {
                    console.log(res);
                    this.tableData = res.data.data.list;
                })
                .catch(err => {
                    console.log(err);
                })
		}
        ,linkClick () {
            this.axios.get('/words/search?query='+encodeURI(this.searchInput))
                .then(res => {
                    console.log(res);
                    this.tableData = res.data.data.list;
                })
                .catch(err => {
                    console.log(err);
                })
        }

        ,searchWord(name){
		    this.searchInput = name;
            this.buttonSearchClick();
		}

		,loadLeft () {
            this.axios.get('/api/words/searchlist?query=%E4%B8%AD%E6%96%87')
                .then(res => {
                    console.log(res);
                    this.leftList = res.data.data;
                    console.log(this.leftList);
                })
                .catch(err => {
                    console.log(err);
                })
        }

        //右上角提示
		,showNotify(message){
            const h = this.$createElement;
            this.$notify({
                message:  message
                ,duration: 3000

            });
		}
       	//关系弹窗
        ,dialogFormRelation(row){
		    this.dialogFormTitle = '“'+ row.srcName +'” 与 “' +row.name +'” 的关系：';
            this.radioRelation = row.relation;
            this.editWord = row.name;
		    this.dialogFormRelationVisible = true;
		}
		//编辑词条弹窗
		,dialogFormWord(name){
            this.editWord = name;
            this.axios.get('/words/word/info?name='+encodeURI(this.editWord))
				.then(res=>{
                    this.dialogFormWordData.synonyms = res.data.data.synonyms;
					this.dialogFormWordData.uppers = res.data.data.uppers;
                    this.dialogFormWordData.downs = res.data.data.downs;
                })
				.catch(err => {
				    console.log(err);
                });
            this.dialogFormWordVisible = true;
		}

		,clickLeftLink(i){
            this.searchInput = i;
			this.buttonSearchClick();
		}

        ,submitRelation(){
            this.axios.post('/relation/add', {
                srcName: this.searchInput
                ,name: this.editWord
                ,relation: this.radioRelation
            })
                .then( response => {
                    this.showNotify(response.data);
                    this.dialogFormRelationVisible = false;
                    this.buttonSearchClick();
                })
                .catch(error => {
                    this.showNotify(error);
                });
		}

		,submitWord(){
            this.axios.post('/words/word/save', {
                name: this.editWord
				,synonyms: this.dialogFormWordData.synonyms
				,uppers: this.dialogFormWordData.uppers
				,downs: this.dialogFormWordData.downs
            })
				.then(response => {
                    this.showNotify(response.data.data);
                    this.dialogFormWordVisible = false;
                    this.buttonSearchClick();
				})
				.catch(error => {
                    this.showNotify(error);
				});
		}

		,clearRadio1(){
            this.radioRelation = '';
		}
        //输入联想开始
        ,querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        loadAll() {
            return [
                { "value": "三全鲜食（北新泾店）", "address": "长宁区" },
                { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "虹路661号" },
                { "value": "新旺角茶餐厅", "address": "上海市普陀区" }
            ];
        },
        handleSelect(item) {
            console.log(item);
        }
        //输入联想结束

	},
    mounted() {
	    document.title = "极天信息";
        this.restaurants = this.loadAll();
        this.loadLeft();

    }
}
</script>




<style>
	#appIndex {

	}
	.el-header {
		background-color: rgba(163, 192, 209, 0.18);
		color: #333;
		line-height: 60px;
	}
	body{
		margin:0;
		padding:0;
	}
	.containerMain{
		height: calc(100vh - 120px );
	}

	.menuLeft{
		overflow-y: auto;
		height: calc(100vh - 180px );
	}

	.top {
		height: 60px;
		/*border-bottom: solid 1px #ddd;*/
		display: flex;
		align-items: center;
		padding: 0 40px;
		background: #2b86f6;
		font-size: 36px;
		color: #fff;
	}

</style>