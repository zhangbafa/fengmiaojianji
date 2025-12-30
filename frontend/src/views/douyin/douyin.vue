<template>
  <div class="douyin-container">
    <a-form :model="form"
            @submit="handleSubmit"
            layout="">
      <a-form-item field="content"
                   label="滚动方向">
        <a-radio-group v-model="form.direction">
          <a-radio value="vertical">向上</a-radio>
          <a-radio value="horizontal">向左</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="lines"
                   label="滚动行数">
        <a-radio-group v-model="form.lines">
          <a-radio :value="1">1行</a-radio>
          <a-radio :value="2">2行</a-radio>
          <a-radio :value="3">3行</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="speed"
                   label="滚动速度">
        <a-input v-model.number="form.speed">
          <template #append> 秒 </template>
        </a-input>
      </a-form-item>
      <a-form-item field="delay"
                   label="停顿时间">
        <a-input v-model.number="form.delay">
          <template #append> 秒 </template>
        </a-input>
      </a-form-item>
      <a-form-item field="content"
                   label="滚动模式">
        <a-space direction="vertical"
                 fill>
          <a-radio-group v-model="form.type">
            <a-radio value="text">
              <img :src="type1"
                   alt=""
                   style="width: 240px" />
            </a-radio>
            <a-radio value="xiadan">
              <img :src="type2"
                   alt=""
                   style="width: 240px" />
            </a-radio>
            <a-radio value="qianggou">
              <img :src="type3"
                   alt=""
                   style="width: 240px" />
            </a-radio>
          </a-radio-group>
        </a-space>
      </a-form-item>
      <!-- <a-form-item field="ad_text"
                   label="滚动内容"
                   v-if="form.type == 'text'">
        <a-textarea placeholder="输入滚动内容，每行一个"
                    v-model="form.ad_text"
                    :auto-size="{
                      minRows: 20,
                    }" />
      </a-form-item>
      <a-form-item field="qiang_goods"
                   label="抢购标题"
                   v-if="form.type == 'qianggou'">
        <a-input v-model="form.qiang_goods" />
      </a-form-item> -->
      <!--  -->
      <a-card>
        <div v-show="form.type == 'xiadan'">
          <a-form-item v-for="(post,index) of form.goods" :field="`posts[${index}].value`" :label="`商品-${index+1}`" :key="index">
            <a-input v-model="post.serial_number" placeholder="商品序号" :style="{width: '33%'}"/>
            <a-input v-model="post.probability" placeholder="概率" :style="{marginLeft:'10px',width:'33%'}"/>
            <a-button @click="handleDeleteXiadan(index)" :style="{marginLeft:'10px'}">删除</a-button>
          </a-form-item>
        <a-button @click="handleAddXiadan" long>添加商品</a-button>
        </div>
        <div v-show="form.type == 'qianggou'">
          <a-form-item v-for="(post,index) of form.qiang_goods" :field="`posts[${index}].value`" :label="`商品-${index+1}`" :key="index">
            <a-input v-model="post.serial_number" placeholder="商品序号" :style="{width: '33%'}"/>
            <a-input v-model="post.probability" placeholder="概率" :style="{marginLeft:'10px',width:'33%'}"/>
            <a-button @click="handleDeleteQianggou(index)" :style="{marginLeft:'10px'}">删除</a-button>
          </a-form-item>
        <a-button @click="handleAddQianggou" long>添加商品</a-button>
        </div>
        <div v-show="form.type == 'text'">
          <a-form-item v-for="(post,index) of form.ad_text" :field="`posts[${index}].value`" :key="index" :label="`内容-${index+1}`">
            <a-row :gutter="10">
              <a-col :span="24" style="margin-bottom: 6px;">
                <div><a-input v-model="post.serial_number" placeholder="商品序号"/></div>
              </a-col>
              <a-col :span="24" style="margin-bottom: 6px;">
                <div><a-input v-model="post.probability" placeholder="概率" /></div>
              </a-col>
              <a-col :span="24" style="display: flex;justify-content: flex-end" >
               <a-button @click="handleDeleteText(index)" long>删除</a-button>
              </a-col>
              <a-divider></a-divider>
            </a-row>
          </a-form-item>
          <a-button @click="handleAddText" long>添加内容</a-button>
        </div>
      </a-card>
      
      <a-divider></a-divider>
      <a-row :gutter="20">
        <a-col :span="12">
          <a-button long
                    html-type="submit"
                    type="primary"
                    status="info">保存配置</a-button>
        </a-col>
        <a-col :span="12">
          <a-button type="primary"
                    long
                    status="success"
                    :loading="loading"
                    @click="handleSaveConfigcreateWindow">打开窗口</a-button>
        </a-col>
      </a-row>
    </a-form>
    <div style="height: 20px;"></div>
  </div>
</template>

<script setup>
import { reactive, onMounted,ref } from "vue";
import { ipcApiRoute } from "@/api";
import { ipc } from "@/utils/ipcRenderer";
import { Message } from "@arco-design/web-vue";
import type1 from "@/assets/1.png";
import type2 from "@/assets/2.png";
import type3 from "@/assets/3.png";

const loading = ref(false)
onMounted(async () => {
  const result = await ipc.invoke(ipcApiRoute.fineoneDouyinConfig);
  console.log(result)
  result.goods = JSON.parse(result.goods)
  result.qiang_goods = JSON.parse(result.qiang_goods)
  result.ad_text = JSON.parse(result.ad_text)
  Object.assign(form, result)


  // ipc.removeAllListeners(ipcApiRoute.window2ToWindow1);
  // ipc.on(ipcApiRoute.window2ToWindow1, (event, arg) => {
  //   Message.info(arg);
  // });
});

const form = reactive({
  direction: "horizontal",
  type: "xiadan",
  delay: 2,
  speed: 0.5,
  lines: 1,
  goods: [{serial_number: 1, probability: 1}],
  qiang_goods: [{serial_number: "抢购1号空调护膝夏季", probability: 1}],
  ad_text: [{serial_number: '默认文本', probability: 1}]
});

// 动态表单添加和删除
const handleAddQianggou = () => {
  form.qiang_goods.push({
    serial_number: '',
    probability: ''
  })
};
const handleDeleteQianggou = (index) => {
  form.qiang_goods.splice(index, 1)
}
const handleAddText = () => {
  form.ad_text.push({
    serial_number: '',
    probability: ''
  })
};
const handleDeleteText = (index) => {
  form.ad_text.splice(index, 1)
}
const handleAddXiadan = () => {
  form.goods.push({
    serial_number: '',
    probability: ''
  })
};
const handleDeleteXiadan = (index) => {
  form.goods.splice(index, 1)
}

const saveConfig = async () => {
  // 强制转换为数字，非数字则用默认值
  const speed = Number(form.speed) || 0.5;
  const delay = Number(form.delay) || 2;
  const lines = Number(form.lines) || 1;

  // 保存转换后的值
  const configToSave = {
    ...form,
    speed,
    delay,
    lines,
    goods: JSON.stringify(form.goods),
    qiang_goods: JSON.stringify(form.qiang_goods),
    ad_text: JSON.stringify(form.ad_text)
  };
  console.log(configToSave)
  try {
    // 使用Store.load方法创建Store实例
    if (form.id) {
      // 更新
      console.log(configToSave)
      const result = await ipc.invoke(ipcApiRoute.updateDouyinConfig, configToSave);
      console.log(result)
      Message.success("提交成功");
    } else {
      // 添加
      const result = await ipc.invoke(ipcApiRoute.addDouyinConfig, configToSave);
      console.log(result)
      Message.success("提交成功");
    }


  } catch (error) {
    console.error("保存音频目录路径失败:", error);
    Message.error("提交失败");
  }
}
const handleSubmit = async (data) => {
  // const params = {
  //   receiver: "window2",
  //   content: "窗口1给窗口2发送消息",
  // };
  // ipc.invoke(ipcApiRoute.window1ToWindow2, params);
  // alert(1);
  // return false;
  const sum = form.goods.reduce((total, currentItem) => {
    // 转换为数值后累加
    return total + parseFloat(currentItem.probability);
  }, 0);
  if(sum>1){
    Message.error('概率总和不能大于1') 
    return false
  }
  if(sum<1){
    Message.error('概率总和不能小于1') 
    return false
  }
  saveConfig()

};

const handleSaveConfigcreateWindow = async (index) => {
  loading.value = true
    // const result = await ipc.invoke(ipcApiRoute.fetchUserInfo)
    // if(!result.is_active){
    //   Message.error('已过期，请充值')
    //   loading.value = false
    //   return false
    // }
   await ipc.invoke(ipcApiRoute.createWindow, {
      type: "vue",
      content: "#/douyinWork/index",
      windowName: "window2",
      windowTitle: "vue window",
      width: 380,
      height: 180,
      transparent: true,
      frame: false,
      openDevTools:false
    });
    loading.value = false

};
</script>

<style>
  .douyin-container{
    padding: 10px;
    /* margin-bottom: 500px; */
  }
</style>
