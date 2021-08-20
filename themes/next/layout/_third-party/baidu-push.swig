{% if theme.baidu_push %}
<script>
(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';        
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
  
 var xhr = new XMLHttpRequest();
	xhr.open('POST', 'http://data.zz.baidu.com/urls?site=https://blog.bitbw.top&token=SQqfOYyQKNbs0xaf');
	// 相比GET方式，POST方式多下面一行代码
	// xhr.setRequestHeader('User-Agent', 'curl/7.12.1');
	// xhr.setRequestHeader('Host', 'data.zz.baidu.com');
	xhr.setRequestHeader('Content-Type', 'text/plain');
	// xhr.setRequestHeader('Content-Length', '83');
	xhr.send('https://blog.bitbw.top/baidusitemap.xml');
	xhr.onload = function () {
		console.log('baidu_test', xhr.response);
	} 
 
})();
</script>
{% endif %}
