$(function() {
    function zhiwang() {
        var timetamp = Number(new Date()); //时间戳
        $.ajax({
            'url': '../json/test.json?v=' + timetamp,
            'data': {},
            'data-type': 'json',
            'type': "GET"
        }).done(function(res) {
            var array = res.products;
            var ru = "";
            $.each(array, function(index, item) {

                if (item.annual_rate >= 1400) {
                    ru += "<tr style='background:red; color:#fff'><td><span>" + item.annual_rate_str + "</span></td><td><a href=''>" + item.duration_str + "</a></td></tr>";
                } else {
                    ru += "<tr><td><span>" + item.annual_rate_str + "</span></td><td><a href=''>" + item.duration_str + "</a></td></tr>";
                };
            });
            $("table").html(ru);
        }).error(function(e) {
            $("body").html("服务器接口异常");
        });
    };
    zhiwang();
    setInterval(zhiwang, 2000)


});