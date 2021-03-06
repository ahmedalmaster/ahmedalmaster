;(function($, window, document, undefined) {
    var HwSlider = function(ele, opt){
        var self = this;
        self.$element = ele,
        self.defaults = {
            width: 600, 
            height: 320, 
            start: 1, 
            speed: 500, 
            interval: 5000,
            autoPlay: true,  
            dotShow: true, 
            arrShow: true, 
            touch: true, 
            afterSlider: function(){}
        },
        self.clickable = true,  
        self.options = $.extend({}, self.defaults, opt)
    }
    HwSlider.prototype = {
        init: function(){
            var self = this,
                ele = self.$element;

            var sliderInder = ele.children('ul')
            var hwsliderLi = sliderInder.children('li');
            var hwsliderSize = hwsliderLi.length;  
            var index = self.options.start;
            var touchStartY = 0,touchStartX = 0;

            if(self.options.arrShow){
                var arrElement = '<a href="javascript:;" class="arr prev">&lt;</a><a href="javascript:;" class="arr next">&gt;</a>';
                ele.append(arrElement);
            }

            for(i=1;i<=hwsliderSize;i++){
                if(index==i) hwsliderLi.eq(index-1).addClass('active');
            }

            if(self.options.dotShow){
                var dot = '';
                for(i=1;i<=hwsliderSize;i++){
                    if(index==i){
                        dot += '<span data-index="'+i+'" class="active"></span>';
                    }else{
                        dot += '<span data-index="'+i+'"></span>';
                    }
                }
                var dotElement = '<div class="dots">'+dot+'</div>';
                ele.append(dotElement);
            }

            var resize = function(){
                var sWidth = ele.width();
                var sHeight = self.options.height/self.options.width*sWidth;
                ele.css('height',sHeight); 

                if(self.options.arrShow){
                    var arrOffset = (sHeight-40)/2;
                    ele.find(".arr").css('top',arrOffset+'px'); 
                }
                if(self.options.dotShow){
                    var dotWidth = hwsliderSize*20;
                    var dotOffset = (sWidth-dotWidth)/2;
                    ele.find(".dots").css('left',dotOffset+'px'); 
                }
            }

            ele.css('height',self.options.height);
            resize();

            $(window).resize(function(){
              resize();
            });


            if(self.options.arrShow){
                ele.find('.next').on('click', function(event) {
                    event.preventDefault();
                    if(self.clickable){
                        if(index >= hwsliderSize){
                            index = 1;
                        }else{
                            index += 1;
                        }
                        self.moveTo(index,'next');
                    }
                });

                ele.find(".prev").on('click', function(event) {
                    event.preventDefault();
                    if(self.clickable){
                        if(index == 1){
                            index = hwsliderSize;
                        }else{
                            index -= 1;
                        }

                        self.moveTo(index,'prev');
                    }
                    
                });
            }

            if(self.options.dotShow){
                ele.find(".dots span").on('click',  function(event) {
                    event.preventDefault();
                    
                    if(self.clickable){
                        var dotIndex = $(this).data('index');
                        if(dotIndex > index){
                            dir = 'next';
                        }else{
                            dir = 'prev';
                        }
                        if(dotIndex != index){
                            index = dotIndex;
                            self.moveTo(index, dir);
                        }
                    }
                });
            }

            if(self.options.autoPlay){
                var timer;
                var play = function(){
                    index++;
                    if(index > hwsliderSize){
                        index = 1;
                    }
                    self.moveTo(index, 'next');
                }
                timer = setInterval(play, self.options.interval); 

                ele.hover(function() {
                    timer = clearInterval(timer);
                }, function() {
                    timer = setInterval(play, self.options.interval);
                });
            };

            if(self.options.touch){
                hwsliderLi.on({
                    'touchstart': function(e) {
                        touchStartY = e.originalEvent.touches[0].clientY;
                        touchStartX = e.originalEvent.touches[0].clientX;
                    },

                    'touchend': function(e) {
                        var touchEndY = e.originalEvent.changedTouches[0].clientY,
                            touchEndX = e.originalEvent.changedTouches[0].clientX,
                            yDiff = touchStartY - touchEndY,
                            xDiff = touchStartX - touchEndX;

                        
                        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
                            if ( xDiff > 5 ) {
                                if(index >= hwsliderSize){
                                    index = 1;
                                }else{
                                    index += 1;
                                }
                                self.moveTo(index,'next');
                            } else {
                                if(index == 1){
                                    index = hwsliderSize;
                                }else{
                                    index -= 1;
                                }
                                self.moveTo(index,'prev');
                            }                       
                        }
                        touchStartY = null;
                        touchStartX = null;
                    },

                    'touchmove': function(e) {
                        if(e.preventDefault) { e.preventDefault(); }

                    }
                });
            }
        },

        moveTo: function(index,dir){ 
            var self = this,
                ele = self.$element;
            var clickable = self.clickable;
            var dots = ele.find(".dots span");
            var sliderInder = ele.children('ul');
            var hwsliderLi = sliderInder.children('li');
            
            if(clickable){
                self.clickable = false;

                var offset = ele.width();
                if(dir == 'prev'){
                    offset = -1*offset;
                }

                sliderInder.children('.active').stop().animate({
                    left: -offset},
                    self.options.speed,
                     function() {
                        $(this).removeClass('active');
                });
                hwsliderLi.eq(index-1).css('left', offset + 'px').addClass('active').stop().animate({
                    left: 0}, 
                    self.options.speed,
                    function(){
                        self.clickable = true;
                });

                self.options.afterSlider.call(self);
                dots.removeClass('active');
                dots.eq(index-1).addClass('active');
                
            }else{
                return false;
            }
        }
        
    }
    

    $.fn.hwSlider = function(options) {
        var hwSlider = new HwSlider(this, options);
        return this.each(function () {
            hwSlider.init();
        });
    };
})(jQuery, window, document);
