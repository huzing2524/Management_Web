<!--
    @file:随机生成验证码模块
-->
<template>
  <div id="captcha">
    <canvas id="canvas" width="80" height="30" v-on:click="drawPic"></canvas>
  </div>
</template>

<script>
  export default {
    name: 'captcha',
    mounted() {
      this.drawPic();
    },
    data() {
      return {};
    },
    props: ['count'],
    watch: {
      count: function () {
        this.drawPic();
      }
    },
    methods: {
      randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      },
      randomColor(min, max) {
        var _r = this.randomNum(min, max);
        var _g = this.randomNum(min, max);
        var _b = this.randomNum(min, max);
        return 'rgb(' + _r + ',' + _g + ',' + _b + ')';
      },
      drawPic() {
        var canvas = document.getElementById('canvas');
        var _str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var _picTxt = '';
        var _num = 4;
        var _width = canvas.width;
        var _height = canvas.height;
        var ctx = canvas.getContext('2d');
        ctx.textBaseline = 'bottom';
        // ctx.fillStyle = this.randomColor(180, 240);
        ctx.fillStyle = '#94c1fb';
        ctx.fillRect(0, 0, _width, _height);
        for (var i = 0; i < _num; i++) {
          var x = (_width - 10) / _num * i + 10;
          // var y = this.randomNum((_height - 5) / 2, _height + 5);
          var y = this.randomNum(_height / 2 + 10, _height / 2 + 14);
          // var deg = this.randomNum(-45, 45);
          var txt = _str[this.randomNum(0, _str.length)];
          _picTxt += txt;
          ctx.fillStyle = this.randomColor(10, 100);
          ctx.font = this.randomNum(22, 24) + 'px SimHei';
          ctx.translate(x, y);
          // ctx.rotate(deg * Math.PI / 180);
          ctx.fillText(txt, 0, 0);
          // ctx.rotate(-deg * Math.PI / 180);
          ctx.translate(-x, -y);
        }
        for (var j = 0; j < _num; j++) {
          ctx.strokeStyle = this.randomColor(90, 180);
          ctx.beginPath();
          ctx.moveTo(this.randomNum(0, _width), this.randomNum(0, _height));
          ctx.lineTo(this.randomNum(0, _width), this.randomNum(0, _height));
          ctx.stroke();
        }
        for (var k = 0; k < _num * 10; k++) {
          ctx.fillStyle = this.randomColor(0, 255);
          ctx.beginPath();
          ctx.arc(this.randomNum(0, _width), this.randomNum(0, _height), 1, 0, 2 * Math.PI);
          ctx.fill();
        }
        this.$emit('captcha', _picTxt);
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #captcha {
    cursor: pointer;
  }
</style>
