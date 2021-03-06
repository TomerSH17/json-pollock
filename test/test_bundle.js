
describe('json-pollock tests', function () {

  var pollockContainer = document.createElement('div');
  document.body.appendChild(pollockContainer);

  function addToBody(element) {
    pollockContainer.innerHTML = "";
    pollockContainer.appendChild(element);
    return pollockContainer;
  }

  var card = {
    "type": "vertical",
    "elements": [{
      "type": "image",
      "url": "assets/iphone-8-concept.jpg",
      "tooltip": "image tooltip",
      "caption": "this is a caption",
      "click": {
        "actions": [{
          "type": "navigate",
          "name": "Navigate to store via image",
          "lo": 23.423423,
          "la": 2423423423
        }]
      }
    }, {
      "type": "text",
      "text": "product name (Title)",
      "tooltip": "text tooltip",
      "style": {
        "bold": true,
        "italic": true,
        "color": "red",
        "size": "large"
      },
    }, {
      "type": "button",
      "tooltip": "button tooltip",
      "title": "Add to cart",
      "alt": "alt text",
      "click": {
        "actions": [{
          "type": "link",
          "name": "add to cart",
          "uri": "http://example.jpg"
        }]
      },
      "style": {
        "bold": false,
        "italic": false,
        "color": "red",
        "size": 'medium'
      },
    },{
      "type": "map",
      "lo": 64.128597,
      "la": -21.896110,
      "tooltip": "map tooltip"
    },]
  }

  describe('render basic elements', function () {

    var fragEl = null;
    var rooEl = null;

    before(function () {
      fragEl = JsonPollock.render(card);
      rooEl = addToBody(fragEl);
    });

    it('Root should be a DocumentFragment instance', function () {
      chai.expect(fragEl).to.be.instanceOf(DocumentFragment);
    });

    it('All rendered elements should be wrapped with a div with a \'lp-json-pollock\' class', function () {
      chai.expect(rooEl.childNodes.length).to.equal(1);
      chai.expect(rooEl.childNodes[0].localName).to.equal('div');
      chai.expect(rooEl.childNodes[0].className).to.equal('lp-json-pollock');
    });

    it('A single container of type layout (horizontal/vertical) is allowed', function () {
      var wrapdiv = rooEl.childNodes[0];
      chai.expect(wrapdiv.childNodes.length).to.equal(1);
      chai.expect(wrapdiv.childNodes[0].localName).to.equal('div');
      chai.expect(wrapdiv.childNodes[0].className).to.equal('lp-json-pollock-layout lp-json-pollock-layout-vertical');
      chai.expect(wrapdiv.childNodes[0].childNodes.length).to.equal(4);
    });

    it('An element of type button should be created', function () {
      var layout = rooEl.childNodes[0].childNodes[0];
      chai.expect(layout.childNodes[2].localName).to.equal('div');
      chai.expect(layout.childNodes[2].className).to.equal('lp-json-pollock-element-button');
      chai.expect(layout.childNodes[2].childNodes[0].localName).to.equal('button');
      chai.expect(layout.childNodes[2].childNodes[0].title).to.equal('button tooltip');
      chai.expect(layout.childNodes[2].childNodes[0].textContent).to.equal('Add to cart');
    });

    it('Check for style generation of text element', function () {
      var layout = rooEl.childNodes[0].childNodes[0];
      chai.expect(layout.childNodes[1].childNodes[0].style).to.be.exist;
      chai.expect(layout.childNodes[1].childNodes[0].style.color).to.equal('red');
      chai.expect(layout.childNodes[1].childNodes[0].style.fontWeight).to.equal('bold');
      chai.expect(layout.childNodes[1].childNodes[0].style.fontSize).to.equal('17px');
      chai.expect(layout.childNodes[1].childNodes[0].style.fontStyle).to.equal('italic');
    });

    it('Check for style generation of button element', function () {
      var layout = rooEl.childNodes[0].childNodes[0];
      chai.expect(layout.childNodes[2].childNodes[0].style).to.be.exist;
      chai.expect(layout.childNodes[2].childNodes[0].style.color).to.equal('red');
      chai.expect(layout.childNodes[2].childNodes[0].style.fontWeight).to.equal('');
      chai.expect(layout.childNodes[2].childNodes[0].style.fontSize).to.equal('13px');
      chai.expect(layout.childNodes[2].childNodes[0].style.fontStyle).to.equal('');
    });

    it('An element of type map should be created', function () {
      var layout = rooEl.childNodes[0].childNodes[0];
      chai.expect(layout.childNodes[3].localName).to.equal('div');
      chai.expect(layout.childNodes[3].className).to.equal('lp-json-pollock-element-map');
      chai.expect(layout.childNodes[3].title).to.equal('map tooltip');
    });

    it('An element of type text should be created', function () {
      var layout = rooEl.childNodes[0].childNodes[0];
      chai.expect(layout.childNodes[1].localName).to.equal('div');
      chai.expect(layout.childNodes[1].className).to.equal('lp-json-pollock-element-text');
      chai.expect(layout.childNodes[1].childNodes[0].localName).to.equal('span');
      chai.expect(layout.childNodes[1].childNodes[0].title).to.equal('text tooltip');
      chai.expect(layout.childNodes[1].childNodes[0].textContent).to.equal('product name (Title)');
    });

    // special cases - we would like the onload and onerror callbacks to be called right after the load
    // therefore the test is async and we add the fargment to the DOM is the test itself 
    it('An element of type image should be created', function (done) {
      fragEl = JsonPollock.render(card);
      var layout = fragEl.childNodes[0].childNodes[0];
      var image = layout.childNodes[0].childNodes[1];          
      chai.expect(layout.childNodes[0].localName).to.equal('div');
      chai.expect(layout.childNodes[0].className).to.equal('lp-json-pollock-element-image loading');
      chai.expect(layout.childNodes[0].childNodes[0].localName).to.equal('span');
      chai.expect(layout.childNodes[0].childNodes[0].textContent).to.equal('this is a caption');
      chai.expect(layout.childNodes[0].childNodes[1].localName).to.equal('img');
      chai.expect(layout.childNodes[0].childNodes[1].src).to.contain('assets/iphone-8-concept.jpg');
      chai.expect(layout.childNodes[0].childNodes[1].title).to.equal('image tooltip');
      var origOnload = image.onload;
      image.onload = function() {
        origOnload.apply(this);
        chai.expect(layout.childNodes[0].className).to.equal('lp-json-pollock-element-image');
        done();
      };
      addToBody(fragEl);      
    });

    it('Image with wrong url should be created with error class', function (done) {
      var errImg = {
        "type": "image",
        "url": "http://example.jpg",
        "tooltip": "image tooltip",
        "click": {
          "actions": [{
            "type": "navigate",
            "name": "Navigate to store via image",
            "lo": 23.423423,
            "la": 2423423423
          }]
        }
      };

      fragEl = JsonPollock.render(errImg);
      var layout = fragEl.childNodes[0].childNodes[0];
      var image = layout.childNodes[0];
      chai.expect(layout.localName).to.equal('div');
      chai.expect(layout.className).to.equal('lp-json-pollock-element-image loading');
      chai.expect(layout.childNodes[0].localName).to.equal('img');
      chai.expect(layout.childNodes[0].src).to.contain('http://example.jpg/');
      chai.expect(layout.childNodes[0].title).to.equal('image tooltip');
      var origOnError = image.onerror;
      image.onerror = function() {
        origOnError.apply(this);
        chai.expect(layout.className).to.equal('lp-json-pollock-element-image error');
        done();
      };
      addToBody(fragEl);      
    });
  });

  describe('render rtl elements', function () {
    var rtlCard = {
      "type": "vertical",
      "elements": [{
        "type": "image",
        "url": "assets/iphone-8-concept.jpg",
        "tooltip": "image tooltip",
        "caption": "איזה יופי של תמונה",
        "rtl": true,
        "click": {
          "actions": [{
            "type": "navigate",
            "name": "Navigate to store via image",
            "lo": 23.423423,
            "la": 2423423423
          }]
        }
      }, {
        "type": "image",
        "url": "/wrong_url",
        "tooltip": "image tooltip",
        "caption": "איזה חרא של תמונה",
        "rtl": true,
        "click": {
          "actions": [{
            "type": "navigate",
            "name": "Navigate to store via image",
            "lo": 23.423423,
            "la": 2423423423
          }]
        }
      }, {
        "type": "text",
        "text": "אייפון 8",
        "tooltip": "text tooltip",
        "rtl": true,
        "style": {
          "bold": true,
          "italic": true,
          "color": "red",
          "size": "large"
        },
      }, {
        "type": "button",
        "tooltip": "button tooltip",
        "title": "קנה",
        "rtl": true,
        "click": {
          "actions": [{
            "type": "link",
            "name": "add to cart",
            "uri": "http://example.jpg"
          }]
        },
      },]
    }
  
    var fragEl = null;
    var rooEl = null;

    before(function () {
      fragEl = JsonPollock.render(rtlCard);
      rooEl = addToBody(fragEl);
    });

    function verifyRTL(el) {
      chai.expect(el.className).to.contain('direction-rtl');
      chai.expect(el.dir).to.equal('rtl');
    }

    it('image element should have dir=rtl and \'direction-rtl\' class', function (done) {
      // special case - we would like the onload callback to be called right after the load
      // therefore the test is async and we add the fargment to the DOM is the test itself 
      fragEl = JsonPollock.render(rtlCard);
      var image = fragEl.childNodes[0].childNodes[0].childNodes[0];
      var origOnload = image.childNodes[1].onload;
      image.childNodes[1].onload = function() {        
        origOnload.apply(this);
        verifyRTL(image);
        done();
      };
      addToBody(fragEl);      
    });

    it('broken image element should still have dir=rtl and \'direction-rtl\' class', function (done) {
      // special case - we would like the onerror callback to be called right after the load
      // therefore the test is async and we add the fargment to the DOM is the test itself 
      fragEl = JsonPollock.render(rtlCard);
      var image = fragEl.childNodes[0].childNodes[0].childNodes[1];
      var origOnError = image.childNodes[1].onerror;
      image.childNodes[1].onerror = function() {  
        origOnError.apply(this);
        verifyRTL(image);
        done();
      };
      addToBody(fragEl);
    });

    it('text element should have dir=rtl and \'direction-rtl\' class', function () {
      var text = rooEl.childNodes[0].childNodes[0].childNodes[2];
      verifyRTL(text);
    });

    it('button element should have dir=rtl and \'direction-rtl\' class', function () {
      var btn = rooEl.childNodes[0].childNodes[0].childNodes[3];
      verifyRTL(btn);
    });

  });

  describe('render layout elements', function () {

    var rooEl = null;
    var firstLayout = null;
    var secondLayout = null;
    var textEl = null;

    it('Horizontal nested in Vertical', function () {

      var conf = {
        "type": "vertical",
        "elements": [{
          "type": "horizontal",
          "elements": [
            {
              "type": "text",
              "text": "foo"
            }
          ]
        }]
      }

      rooEl = addToBody(JsonPollock.render(JSON.stringify(conf)));

      firstLayout = rooEl.childNodes[0].childNodes[0];
      secondLayout = rooEl.childNodes[0].childNodes[0].childNodes[0];
      textEl = secondLayout.childNodes[0];
      
      chai.expect(firstLayout.className).to.contain('lp-json-pollock-layout lp-json-pollock-layout-vertical');
      chai.expect(secondLayout.className).to.contain('lp-json-pollock-layout lp-json-pollock-layout-horizontal');
      chai.expect(textEl.className).to.contain('lp-json-pollock-element-text');
    });

    it('Vertical nested in Horizontal', function () {

      var conf = {       
        "type": "horizontal",
        "elements": [{
          "type": "vertical",
          "elements": [
            {
              "type": "text",
              "text": "foo"
            }
          ]
        }]
      }

      rooEl = addToBody(JsonPollock.render(JSON.stringify(conf)));

      firstLayout = rooEl.childNodes[0].childNodes[0];
      secondLayout = rooEl.childNodes[0].childNodes[0].childNodes[0];
      textEl = secondLayout.childNodes[0];
      
      chai.expect(firstLayout.className).to.contain('lp-json-pollock-layout lp-json-pollock-layout-horizontal');
      chai.expect(secondLayout.className).to.contain('lp-json-pollock-layout lp-json-pollock-layout-vertical');
      chai.expect(textEl.className).to.contain('lp-json-pollock-element-text');
    });

    describe('massive content', function () {

      it('Horizontal layout with many elements - width must not exceeds parent layout', function () {

        var conf = {
          "type": "horizontal",          
            "elements": [
              {
                "type": "text",
                "text": "foo1"
              },
              {
                "type": "text",
                "text": "foo2"
              },
              {
                "type": "text",
                "text": "foo3"
              },
              {
                "type": "text",
                "text": "foo4"
              },
              {
                "type": "text",
                "text": "foo5"
              },
              {
                "type": "text",
                "text": "foo6"
              },
              {
                "type": "text",
                "text": "foo7"
              },
              {
                "type": "text",
                "text": "foo7"
              },
              {
                "type": "text",
                "text": "foo8"
              },
              {
                "type": "text",
                "text": "foo9"
              },
              {
                "type": "text",
                "text": "foo10"
              },
              {
                "type": "image",
                "url": "http://example.jpg",
                "tooltip": "image tooltip",
                "click": {
                  "actions": [{
                    "type": "navigate",
                    "name": "Navigate to store via image",
                    "lo": 23423423,
                    "la": 2423423423
                  }]
                }
              },
              {
                "type": "image",
                "url": "http://example.jpg",
                "tooltip": "image tooltip",
                "click": {
                  "actions": [{
                    "type": "navigate",
                    "name": "Navigate to store via image",
                    "lo": 23423423,
                    "la": 2423423423
                  }]
                }
              },
              {
                "type": "button",
                "tooltip": "button tooltip",
                "title": "Add to cart",
                "click": {
                  "actions": [{
                    "type": "link",
                    "name": "add to cart",
                    "uri": "https://example.com"   
                  }]
                }
              },
              {
                "type": "button",
                "tooltip": "button tooltip",
                "title": "Publish text",
                "click": {
                  "metadata": [{
                    "event": "PublishTextEvent"
                  }],
                  "actions": [{
                    "type": "publishText",
                    "text": "my text",
                  }]
                }
              }
            ]
        }

        rooEl = addToBody(JsonPollock.render(JSON.stringify(conf)));

        layout = rooEl.childNodes[0].childNodes[0];
        var layoutWidth = layout.offsetWidth;
        var elementsWidth = 0;
        Array.prototype.forEach.call(layout.childNodes, function (node) {
          elementsWidth += node.offsetWidth;
        });
        
        chai.expect(layout.className).to.contain('lp-json-pollock-layout lp-json-pollock-layout-horizontal');
        chai.expect(elementsWidth).to.be.at.least(layoutWidth - 10);
        // chai.expect(elementsWidth).to.be.at.most(layoutWidth);
      });

      it('Vertical with very long text should wrap word', function () {

        var conf = {
          "type": "vertical",
          "elements": [{
            "type": "text",
            "text": "very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long text...",
            "tooltip": "text tooltip"
          }]
        }

        rooEl = addToBody(JsonPollock.render(JSON.stringify(conf)));

        layout = rooEl.childNodes[0].childNodes[0];
        textEl = rooEl.childNodes[0].childNodes[0].childNodes[0];
        
        var layoutWidth = layout.offsetWidth;
        var layoutHeight = layout.offsetHeight;
        var textWidth = textEl.offsetWidth;
        var textHeight = textEl.offsetHeight;
        
        chai.expect(layout.className).to.contain('lp-json-pollock-layout lp-json-pollock-layout-vertical');        
        chai.expect(textWidth).to.be.at.most(layoutWidth);
        chai.expect(textHeight).to.be.at.most(layoutHeight);
      });

    });

  });

  describe('render carousel', function(){

    var conf = {
      "type": "carousel",
      "padding": 10,
      "elements": [
        {
          "type": "vertical",
          "elements": [
            {
              "type": "text",
              "text": "1",
              "tooltip": "1",
              "rtl": false,
              "style": {
                "bold": false,
                "italic": false,
                "color": "#000000",
                "size": "large"
              }
            },
            {
              "type": "text",
              "text": "Twelve month plan BYO mobile",
              "tooltip": "Twelve month plan BYO mobile",
              "rtl": false,
              "style": {
                "bold": true,
                "italic": false,
                "color": "#000000"
              }
            },
            {
              "type": "button",
              "tooltip": "Choose a plan",
              "title": "Choose a plan",
              "click": {
                "metadata": [
                  {
                    "type": "ExternalId",
                    "id": "ANOTHER_ONE_1"
                  }
                ],
                "actions": [
                  {
                    "type": "publishText",
                    "text": "SIM only plan"
                  }
                ]
              }
            }
          ]
        },
        {
          "type": "vertical",
          "elements": [
            {
              "type": "text",
              "text": "2",
              "tooltip": "2",
              "rtl": false,
              "style": {
                "bold": false,
                "italic": false,
                "color": "#000000",
                "size": "large"
              }
            },
            {
              "type": "text",
              "text": "Two year plan leasing a mobile",
              "tooltip": "Two year plan leasing a mobile",
              "rtl": false,
              "style": {
                "bold": true,
                "italic": false,
                "color": "#000000"
              }
            },
            {
              "type": "button",
              "tooltip": "Choose a plan",
              "title": "Choose a plan",
              "click": {
                "metadata": [
                  {
                    "type": "ExternalId",
                    "id": "ANOTHER_ONE_2"
                  }
                ],
                "actions": [
                  {
                    "type": "publishText",
                    "text": "Two year plan leasing a mobile"
                  }
                ]
              }
            }
          ]
        },
        {
          "type": "vertical",
          "elements": [
            {
              "type": "text",
              "text": "3",
              "tooltip": "3",
              "rtl": false,
              "style": {
                "bold": false,
                "italic": false,
                "color": "#000000",
                "size": "large"
              }
            },
            {
              "type": "text",
              "text": "Two year plan with a mobile",
              "tooltip": "Two year plan with a mobile",
              "rtl": false,
              "style": {
                "bold": true,
                "italic": false,
                "color": "#000000"
              }
            },
            {
              "type": "button",
              "tooltip": "Choose a plan",
              "title": "Choose a plan",
              "click": {
                "metadata": [
                  {
                    "type": "ExternalId",
                    "id": "ANOTHER_ONE_3"
                  }
                ],
                "actions": [
                  {
                    "type": "publishText",
                    "text": "Mobiles on a plan"
                  }
                ]
              }
            }
          ]
        }
      ]
    };

    const conteiner = addToBody(JsonPollock.render(JSON.stringify(conf)));
    const carouselRoot = conteiner.children[0];
    const carouselRootWrapper = conteiner.children[0].children[0];
    const carouselRootLayout = conteiner.children[0].children[0];
    const carouselRight = conteiner.children[0].children[0].children[1];
    const carouselLeft = conteiner.children[0].children[0].children[2];
    const card1 = carouselRootLayout.children[0].children[0];
    const card2 = carouselRootLayout.children[0].children[1];
    const card3 = carouselRootLayout.children[0].children[2];

    it('carousel root exist', function () {
      chai.expect(carouselRoot.className).to.contain('lp-json-pollock');
    });

    it('carousel wrapper root exist', function () {
      chai.expect(carouselRootWrapper.className).to.contain('lp-json-pollock-layout-carousel-wrapper');
    });

    it('carousel root layout exist', function () {
      chai.expect(carouselRootLayout.className).to.contain('lp-json-pollock-layout-carousel');
    });

    it('carousel arrow right exist', function () {
      chai.expect(carouselRight.className).to.contain('lp-json-pollock-layout-carousel-arrow');
    });

    it('carousel arrow right holds component action mark', function () {
      chai.expect(carouselRight.className).to.contain('lp-json-pollock-component-action lp-json-pollock-layout-carousel-arrow');
    });

    it('carousel arrow left exist', function () {
      chai.expect(carouselLeft.className).to.contain('lp-json-pollock-layout-carousel-arrow left');
    });

    it('carousel arrow left holds component action mark', function () {
      chai.expect(carouselLeft.className).to.contain('lp-json-pollock-component-action lp-json-pollock-layout-carousel-arrow left');
    });

    it('carousel elements length equal to conf element length', function () {
      chai.expect(carouselRootLayout.children.length).to.be.equal(conf.elements.length);
    });

    it('carousel elements are in the right order', function () {
      chai.expect(card1.children[0].innerText).to.be.equal('1');
      chai.expect(card2.children[0].innerText).to.be.equal('2');
      chai.expect(card3.children[0].innerText).to.be.equal('3');
    });
  });

  describe('border policy', function () {
    
    var rooEl = null;
    var firstLayout = null;
    var secondLayout = null;
    var simpleEl = null;

    function getStyle(elem, style) {
      return window.getComputedStyle(elem)[style];
    }

    it('Root vertical and horizontal layout should have a complete border', function () {
      
      var conf1 = {
        "type": "vertical",
        "elements": [{
          "type": "text",
          "text": "foo"
        }]
      }
      var conf2 = {
        "type": "horizontal",
        "elements": [{
          "type": "text",
          "text": "foo"
        }]
      }

      rooEl = addToBody(JsonPollock.render(JSON.stringify(conf1)));

      firstLayout = rooEl.childNodes[0].childNodes[0];
      chai.expect(getStyle(firstLayout, 'border')).to.contain('1px solid');

      rooEl = addToBody(JsonPollock.render(JSON.stringify(conf2)));
      
      firstLayout = rooEl.childNodes[0].childNodes[0];
      chai.expect(getStyle(firstLayout, 'border')).to.contain('1px solid');
    });

    describe('First vertical and horizontal layout child should have no border', function () {

      it('horizontal with vertical as first child', function () {
        var conf = {
          "type": "horizontal",
          "elements": [
            {
              "type": "vertical",
              "elements": [{
                "type": "text",
                "text": "foo"
              }]
            }
          ]
        };        
  
        rooEl = addToBody(JsonPollock.render(JSON.stringify(conf)));
  
        secondLayout = rooEl.childNodes[0].childNodes[0].childNodes[0];
        chai.expect(getStyle(secondLayout, 'border')).to.contain('none');
        chai.expect(getStyle(secondLayout, 'borderLeft')).to.contain('none');
        chai.expect(getStyle(secondLayout, 'borderTop')).to.contain('none');
        chai.expect(getStyle(secondLayout, 'borderBottom')).to.contain('none');
        chai.expect(getStyle(secondLayout, 'borderRight')).to.contain('none');
      });

      it('vertical with horizontal as first child', function () {
        var conf = {
          "type": "vertical",
          "elements": [
            {
              "type": "horizontal",
              "elements": [{
                "type": "text",
                "text": "foo"
              }]
            }
          ]
        };        
  
        rooEl = addToBody(JsonPollock.render(JSON.stringify(conf)));
  
        secondLayout = rooEl.childNodes[0].childNodes[0].childNodes[0];
        chai.expect(getStyle(secondLayout, 'border')).to.contain('none');
        chai.expect(getStyle(secondLayout, 'borderLeft')).to.contain('none');
        chai.expect(getStyle(secondLayout, 'borderTop')).to.contain('none');
        chai.expect(getStyle(secondLayout, 'borderBottom')).to.contain('none');
        chai.expect(getStyle(secondLayout, 'borderRight')).to.contain('none');
      });

      it('vertical with simple element (button) as first child', function () {
        var conf = {
          "type": "vertical",
          "elements": [
            {
              "type": "button",
              "tooltip": "button tooltip",
              "title": "Add to cart",
              "click": {
                "actions": [{
                  "type": "link",
                  "name": "add to cart",
                  "uri": "http://example.jpg"
                }]
              }
            }
          ]
        };        
  
        rooEl = addToBody(JsonPollock.render(JSON.stringify(conf)));
  
        simpleEl = rooEl.childNodes[0].childNodes[0].childNodes[0];
        chai.expect(getStyle(simpleEl, 'border')).to.contain('none');
        chai.expect(getStyle(simpleEl, 'borderLeft')).to.contain('none');
        chai.expect(getStyle(simpleEl, 'borderTop')).to.contain('none');
        chai.expect(getStyle(simpleEl, 'borderBottom')).to.contain('none');
        chai.expect(getStyle(simpleEl, 'borderRight')).to.contain('none');
      });

      it('horizontal with simple element (button) as first child', function () {
        var conf = {
          "type": "vertical",
          "elements": [
            {
              "type": "button",
              "tooltip": "button tooltip",
              "title": "Add to cart",
              "click": {
                "actions": [{
                  "type": "link",
                  "name": "add to cart",
                  "uri": "http://example.jpg"
                }]
              }
            }
          ]
        };        
  
        rooEl = addToBody(JsonPollock.render(JSON.stringify(conf)));
  
        simpleEl = rooEl.childNodes[0].childNodes[0].childNodes[0];
        chai.expect(getStyle(simpleEl, 'border')).to.contain('none');
        chai.expect(getStyle(simpleEl, 'borderLeft')).to.contain('none');
        chai.expect(getStyle(simpleEl, 'borderTop')).to.contain('none');
        chai.expect(getStyle(simpleEl, 'borderBottom')).to.contain('none');
        chai.expect(getStyle(simpleEl, 'borderRight')).to.contain('none');
      });
    });

    describe('Vertical layout\'s child with is not the first child should have a top border only', function () {

      it('Layout element as second child', function () {
        var conf = {
          "type": "vertical",
          "elements": [
            {
              "type": "text",
              "text": "product name (Title)",
              "tooltip": "text tooltip"
            },
            {
              "type": "horizontal",
              "elements": [
                {
                  "type": "button",
                  "tooltip": "button tooltip",
                  "title": "Add to cart",
                  "click": {
                    "actions": [{
                      "type": "link",
                      "name": "add to cart",
                      "uri": "http://example.jpg"
                    }]
                  }
                }    
              ]
            }
          ]
        };        
  
        rooEl = addToBody(JsonPollock.render(JSON.stringify(conf)));
  
        simpleEl = rooEl.childNodes[0].childNodes[0].childNodes[1];
        chai.expect(getStyle(simpleEl, 'borderTop')).to.contain('1px solid');
        chai.expect(getStyle(simpleEl, 'borderLeft')).to.contain('none');        
        chai.expect(getStyle(simpleEl, 'borderBottom')).to.contain('none');
        chai.expect(getStyle(simpleEl, 'borderRight')).to.contain('none');
      });

      it('simple element (button) as second child', function () {
        var conf = {
          "type": "vertical",
          "elements": [
            {
              "type": "text",
              "text": "product name (Title)",
              "tooltip": "text tooltip"
            },
            {
              "type": "button",
              "tooltip": "button tooltip",
              "title": "Add to cart",
              "click": {
                "actions": [{
                  "type": "link",
                  "name": "add to cart",
                  "uri": "http://example.jpg"
                }]
              }
            }
          ]
        };        
  
        rooEl = addToBody(JsonPollock.render(JSON.stringify(conf)));
  
        simpleEl = rooEl.childNodes[0].childNodes[0].childNodes[1];
        chai.expect(getStyle(simpleEl, 'borderTop')).to.contain('1px solid');
        chai.expect(getStyle(simpleEl, 'borderLeft')).to.contain('none');        
        chai.expect(getStyle(simpleEl, 'borderBottom')).to.contain('none');
        chai.expect(getStyle(simpleEl, 'borderRight')).to.contain('none');
      });

      it('Execptional case - text element followd by a text element should have no border', function () {
        var conf = {
          "type": "vertical",
          "elements": [
            {
              "type": "text",
              "text": "product name (Title)",
              "tooltip": "text tooltip"
            },
            {
              "type": "text",
              "text": "product name (Title)",
              "tooltip": "text tooltip"
            }
          ]
        };        
  
        rooEl = addToBody(JsonPollock.render(JSON.stringify(conf)));
  
        simpleEl = rooEl.childNodes[0].childNodes[0].childNodes[1];
        chai.expect(getStyle(simpleEl, 'border')).to.contain('none');
        chai.expect(getStyle(simpleEl, 'borderLeft')).to.contain('none');
        chai.expect(getStyle(simpleEl, 'borderTop')).to.contain('none');
        chai.expect(getStyle(simpleEl, 'borderBottom')).to.contain('none');
        chai.expect(getStyle(simpleEl, 'borderRight')).to.contain('none');
      });

    });

    describe('Horizontal layout\'s child with is not the first child should have a left border only', function () {
      
      it('Layout element as second child', function () {
        var conf = {
          "type": "horizontal",
          "elements": [
            {
              "type": "text",
              "text": "product name (Title)",
              "tooltip": "text tooltip"
            },
            {
              "type": "horizontal",
              "elements": [
                {
                  "type": "button",
                  "tooltip": "button tooltip",
                  "title": "Add to cart",
                  "click": {
                    "actions": [{
                      "type": "link",
                      "name": "add to cart",
                      "uri": "http://example.jpg"
                    }]
                  }
                }    
              ]
            }
          ]
        };        
  
        rooEl = addToBody(JsonPollock.render(JSON.stringify(conf)));
  
        simpleEl = rooEl.childNodes[0].childNodes[0].childNodes[1];
        chai.expect(getStyle(simpleEl, 'borderLeft')).to.contain('1px solid');
        chai.expect(getStyle(simpleEl, 'borderTop')).to.contain('none');        
        chai.expect(getStyle(simpleEl, 'borderBottom')).to.contain('none');
        chai.expect(getStyle(simpleEl, 'borderRight')).to.contain('none');
      });

      it('simple element (button) as second child', function () {
        var conf = {
          "type": "horizontal",
          "elements": [
            {
              "type": "text",
              "text": "product name (Title)",
              "tooltip": "text tooltip"
            },
            {
              "type": "button",
              "tooltip": "button tooltip",
              "title": "Add to cart",
              "click": {
                "actions": [{
                  "type": "link",
                  "name": "add to cart",
                  "uri": "http://example.jpg"
                }]
              }
            }
          ]
        };        
  
        rooEl = addToBody(JsonPollock.render(JSON.stringify(conf)));
  
        simpleEl = rooEl.childNodes[0].childNodes[0].childNodes[1];
        chai.expect(getStyle(simpleEl, 'borderLeft')).to.contain('1px solid');
        chai.expect(getStyle(simpleEl, 'borderTop')).to.contain('none');        
        chai.expect(getStyle(simpleEl, 'borderBottom')).to.contain('none');
        chai.expect(getStyle(simpleEl, 'borderRight')).to.contain('none');
      });

    });

  });

  describe('render single element (no layout)', function () {

    var rooEl = null;
    var childEl = null;

    function singleElementTest(title, conf, assertionClass) {
      it(title + ' element' , function () {
        
        rooEl = addToBody(JsonPollock.render(conf));
        
        var wrapdiv = rooEl.childNodes[0];      
        chai.expect(wrapdiv.localName).to.equal('div');
        chai.expect(wrapdiv.className).to.equal('lp-json-pollock lp-json-pollock-single-element');
        chai.expect(wrapdiv.childNodes.length).to.equal(1);
  
        childEl = wrapdiv.childNodes[0];
        chai.expect(childEl.className).to.contain(assertionClass);
      });
    }

    singleElementTest('Text',
    {
      "type": "text",
      "text": "product name (Title)",
      "tooltip": "text tooltip"
    },
    'lp-json-pollock-element-text');

    singleElementTest('Button',
    {
      "type": "button",
      "tooltip": "button tooltip",
      "title": "Add to cart",
      "click": {
        "actions": [{
          "type": "link",
          "name": "add to cart",
          "uri": "http://example.jpg"
        }]
      }
    },
    'lp-json-pollock-element-button');

    singleElementTest('Image',
    {
      "type": "image",
      "url": "http://example.jpg",
      "tooltip": "image tooltip",
      "click": {
        "actions": [{
          "type": "navigate",
          "name": "Navigate to store via image",
          "lo": 23.423423,
          "la": 2423423423
        }]
      }
    },
    'lp-json-pollock-element-image');

    singleElementTest('Map',
    {
      "type": "map",
      "lo": 64.128597,
      "la": -21.896110,
      "tooltip": "map tooltip"
    },
    'lp-json-pollock-element-map');

  });

  describe('special characters', function () {
    
    var rooEl = null;
    var childEl = null;

    it('special characters on text tooltip should be escaped', function () {
      var conf = {
        "type": "text",
        "text": "product name (Title)",
        "tooltip": "and & lt < gt > quot \"\n sqout ' slash / ssqout ` eq ="
      }

      rooEl = addToBody(JsonPollock.render(conf));
      
      childEl = rooEl.childNodes[0].childNodes[0].childNodes[0];
      chai.expect(childEl.title).to.equal("and & lt < gt > quot \"\n sqout ' slash / ssqout ` eq =");
    });

    it('newline character on text content should be replaced with <br>', function () {
      var conf = {
        "type": "text",
        "text": "line1\nline2"
      }

      rooEl = addToBody(JsonPollock.render(conf));
      
      childEl = rooEl.childNodes[0].childNodes[0].childNodes[0];
      chai.expect(childEl.innerHTML).to.equal("line1<br>line2");
    });
    
  });

  describe('trigger actions', function () {

    var rooEl = null;
    var conf = null;
  
    //although most browser can deal with element.click() - phantomjs doesnt for some elements (e.g. img)
    //therefore this prehistoric method is needed
    function createClickEvent() {
      var event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', true, true, window, 1, 0, 0);

      return event;
    }

    before(function () {
      conf = {
        "type": "vertical",
        "elements": [{
          "type": "image",
          "url": "http://example.jpg",
          "tooltip": "image tooltip",
          "click": {
            "actions": [{
              "type": "navigate",
              "name": "Navigate to store via image",
              "lo": 23423423,
              "la": 2423423423
            }]
          }
        }, {
          "type": "button",
          "tooltip": "button tooltip",
          "title": "Add to cart",
          "click": {
            "actions": [{
              "type": "link",
              "name": "add to cart",
              "uri": "https://example.com"   
            }]
          }
        },{
          "type": "button",
          "tooltip": "button tooltip",
          "title": "Publish text",
          "click": {
            "metadata": [{
              "event": "PublishTextEvent"
            }],
            "actions": [{
              "type": "publishText",
              "text": "my text",
            }]
          }
        },{
          "type": "button",
          "tooltip": "button tooltip",
          "title": "Publish text and link",
          "click": {
            "metadata": [{
              "event": "PublishTextEvent"
            }],
            "actions": [{
              "type": "publishText",
              "text": "my text",
            },{
              "type": "link",
              "name": "add to cart",
              "uri": "https://example.com",
              "ios": {
                "uri": "https://ios.example.com"
              },
              "android": {
                "uri": "https://android.example.com"
              },
              "web": {
                "uri": "https://web.example.com"
              },
              "target": "blank"
            }]
          }
        },{
          "type": "map",
          "lo": 64.128597,
          "la": -21.896110,
          "tooltip": "map tooltip"
        },{
          "type": "map",
          "lo": 64.128597,
          "la": -21.896110,
          "tooltip": "map tooltip",
          "click": {
            "actions": [{
              "type": "navigate",
              "name": "Navigate to store via map",
              "lo": 23423423,
              "la": 2423423423
            }]
          }
        },]
      }

      rooEl = addToBody(JsonPollock.render(conf));
    });

    it('Click on element with navigate action should trigger its registered callbacks', function () {
      var spy = sinon.spy();
      var event = createClickEvent();
      JsonPollock.registerAction('navigate', spy);
      rooEl.childNodes[0].childNodes[0].childNodes[0].childNodes[0].dispatchEvent(event);
      chai.expect(spy).to.have.been.calledWith({actionData: conf.elements[0].click.actions[0], uiEvent: event});
    });

    it('Click on element with link action should trigger its registered callbacks', function () {
      var spy = sinon.spy();
      var event = createClickEvent();
      JsonPollock.registerAction('link', spy);
      rooEl.childNodes[0].childNodes[0].childNodes[1].childNodes[0].dispatchEvent(event);
      chai.expect(spy).to.have.been.calledWith({actionData: conf.elements[1].click.actions[0], uiEvent: event});
    });

    it('Click on element with publishText action should trigger its registered callbacks', function () {
      var spy = sinon.spy();
      var event = createClickEvent();
      JsonPollock.registerAction('publishText', spy);
      rooEl.childNodes[0].childNodes[0].childNodes[2].childNodes[0].dispatchEvent(event);
      chai.expect(spy).to.have.been.calledWith({actionData: conf.elements[2].click.actions[0], metadata: conf.elements[2].click.metadata, uiEvent: event});
    });

    it('Click on element with multiple actions should trigger its registered callbacks', function () {
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();
      var event = createClickEvent();
      JsonPollock.registerAction('publishText', spy1);
      JsonPollock.registerAction('link', spy2);
      rooEl.childNodes[0].childNodes[0].childNodes[3].childNodes[0].dispatchEvent(event);
      chai.expect(spy1).to.have.been.calledWith({actionData: conf.elements[3].click.actions[0], metadata: conf.elements[3].click.metadata, uiEvent: event});
      chai.expect(spy2).to.have.been.calledWith({actionData: conf.elements[3].click.actions[1], metadata: conf.elements[3].click.metadata, uiEvent: event});
    });

    it('Click on map element which has no actions definition should trigger window.open for google maps', function () {
      window.open = sinon.spy();
      rooEl.childNodes[0].childNodes[0].childNodes[4].dispatchEvent(createClickEvent());
      chai.expect(window.open).to.have.been.calledWith('https://www.google.com/maps/search/?api=1&query=-21.89611,64.128597');
    });

    it('Click on element with link action should not trigger its registered callbacks after unregister', function () {
        var spy = sinon.spy();
        JsonPollock.registerAction('link', spy);
        JsonPollock.unregisterAction('link');
        rooEl.childNodes[0].childNodes[0].childNodes[1].childNodes[0].dispatchEvent(createClickEvent());
        chai.expect(spy).to.have.callCount(0);
    });

    it('Click on element with link action should not trigger its registered callbacks after unregister all', function () {
        var spy = sinon.spy();
        JsonPollock.registerAction('link', spy);
        JsonPollock.unregisterAllActions();
        rooEl.childNodes[0].childNodes[0].childNodes[1].childNodes[0].dispatchEvent(createClickEvent());
        chai.expect(spy).to.have.callCount(0);
    });

    it('Click on map element which has actions definition should not trigger window.open for google maps', function () {
      window.open = sinon.spy();
      var spy1 = sinon.spy();
      var event = createClickEvent();
      JsonPollock.registerAction('navigate', spy1);
      rooEl.childNodes[0].childNodes[0].childNodes[5].dispatchEvent(event);
      chai.expect(window.open).to.have.not.been.calledWith('https://www.google.com/maps/search/?api=1&query=64.128597,-21.89611');
      chai.expect(spy1).to.have.been.calledWith({actionData: conf.elements[5].click.actions[0], uiEvent: event});
    });

  });

  describe('render json string', function () {

    var rooEl = null;

    before(function () {
      var conf = {
        "type": "vertical",
        "elements": [{
          "type": "image",
          "url": "http://example.jpg",
          "tooltip": "image tooltip",
          "click": {
            "actions": [{
              "type": "navigate",
              "name": "Navigate to store via image",
              "lo": 23423423,
              "la": 2423423423
            }]
          }
        }, {
          "type": "text",
          "text": "product name (Title)",
          "tooltip": "text tooltip",
          "style": {
            "bold": true,
            "italic": true,
            "color": "red",
            "size": "large"
          },
        }, {
          "type": "button",
          "tooltip": "button tooltip",
          "title": "Add to cart",
          "click": {
            "actions": [{
              "type": "link",
              "name": "add to cart",
              "uri": "http://example.jpg"
            }]
          },
          "style": {
            "bold": false,
            "italic": false,
            "color": "red",
            "size": 'medium'
          },
        },]
      }

      rooEl = JsonPollock.render(JSON.stringify(conf));
    });

    it('DOM element exists', function () {
      chai.expect(rooEl).to.be.instanceOf(DocumentFragment);
    });
  });

  describe('Image element fail to load', function () {

    var rooEl = null;
    var imgDiv = null;
    var imgEl = null;

    before(function (done) {
      var conf = {
        "type": "vertical",
        "elements": [{
          "type": "image",
          "url": "http://does_not_exists.jpg",
          "tooltip": "image tooltip",
          "click": {
            "actions": [{
              "type": "navigate",
              "name": "Navigate to store via image",
              "lo": 23423423,
              "la": 2423423423
            }]
          }
        }]
      }

      rooEl = addToBody(JsonPollock.render(JSON.stringify(conf)));

      imgDiv = rooEl.childNodes[0].childNodes[0].childNodes[0];
      imgEl = imgDiv.childNodes[0];
      var originalOnError = imgEl.onerror;
      imgEl.onerror = function () {
        originalOnError.call(imgEl);
        done();
      }
    });

    it('Image div should have error class', function () {
      chai.expect(imgDiv.className).to.contain('error');
    });

    it('Image div should have error message in title', function () {
      chai.expect(imgDiv.title).to.equal('fail to load image');
    });

    it('Image element should be hidden', function () {
      chai.expect(imgEl.style.display).to.equal('none');
    });

  });

  describe('configuration', function () {

    var rooEl = null;

    describe('if maxAllowedElements is configured to x only first x elements should be presented (incl. layout)', function () {
      before(function () {
        JsonPollock.init({ maxAllowedElements: 2 });
        rooEl = addToBody(JsonPollock.render(card));
      });

      after(function () {
        //reset
        JsonPollock.init({ maxAllowedElements: -1 });
      });

      it('All rendered elements should be wrapped with a div with a \'lp-json-pollock\' class', function () {
        chai.expect(rooEl.childNodes.length).to.equal(1);
        chai.expect(rooEl.childNodes[0].localName).to.equal('div');
        chai.expect(rooEl.childNodes[0].className).to.equal('lp-json-pollock');
      });

      it('A single container of type layout (horizontal/vertical) was created with a single child elemnt', function () {
        var wrapdiv = rooEl.childNodes[0];
        chai.expect(wrapdiv.childNodes.length).to.equal(1);
        chai.expect(wrapdiv.childNodes[0].localName).to.equal('div');
        chai.expect(wrapdiv.childNodes[0].className).to.equal('lp-json-pollock-layout lp-json-pollock-layout-vertical');
        chai.expect(wrapdiv.childNodes[0].childNodes.length).to.equal(1);
      });

      it('An element of type image should be created', function () {
        var layout = rooEl.childNodes[0].childNodes[0];
        chai.expect(layout.childNodes[0].localName).to.equal('div');
        chai.expect(layout.childNodes[0].className).to.contain('lp-json-pollock-element-image');  //it can also includes loading
        chai.expect(layout.childNodes[0].childNodes[1].localName).to.equal('img');
        chai.expect(layout.childNodes[0].childNodes[1].src).to.contain('assets/iphone-8-concept.jpg');
        chai.expect(layout.childNodes[0].childNodes[1].title).to.equal('image tooltip');
      });

    });

  });

  describe('Negative tests', function () {

    var SCHEMA_VALIDATION_ERR = 'Schema validation error, see \'errors\' for more details';

    it('Wrong json representation trigger an error', function () {
      var wrongJson = '{"type": "vertical"';
      chai.expect(JsonPollock.render.bind(JsonPollock, wrongJson)).to.throw();  //json error
    });

    describe('Mandatory elements', function () {
      it('If element of type layout is lack of mandatory properties (elements) an invalid schema error should be triggered', function () {
        var verticalNoElements = {
          "type": "vertical"
        };
        chai.expect(JsonPollock.render.bind(JsonPollock, verticalNoElements)).to.throw(SCHEMA_VALIDATION_ERR);
      });

      it('If element of type text is lack of mandatory properties (text) an invalid schema error should be triggered', function () {
        var textNoText = {
          "type": "vertical",
          "elements": [{
            "type": "text",
            "tooltip": "text tooltip",
            "rtl": true
          }]
        };
        chai.expect(JsonPollock.render.bind(JsonPollock, textNoText)).to.throw(SCHEMA_VALIDATION_ERR);
      });

      it('If element of type button is lack of mandatory properties (title, action) an invalid schema error should be triggered', function () {
        var buttonNoTile = {
          "type": "vertical",
          "elements": [{
            "type": "button",
            "click": {
              "actions": [{
                "type": "navigate",
                "lo": 23423423,
                "la": 2423423423
              }]
            },
            "tooltip": "button tooltip",
            "rtl": true
          }]
        };

        var buttonNoAction = {
          "type": "vertical",
          "elements": [{
            "type": "button",
            "title": "Push Me!",
            "tooltip": "button tooltip",
            "rtl": true
          }]
        };

        chai.expect(JsonPollock.render.bind(JsonPollock, buttonNoTile)).to.throw(SCHEMA_VALIDATION_ERR);
        // uncomment once added to schema
        //chai.expect(JsonPollock.render.bind(JsonPollock, buttonNoAction)).to.throw(SCHEMA_VALIDATION_ERR);
      });

      it('If element of type map is lack of mandatory properties (url) an invalid schema error should be triggered', function () {
        var mapNoLaLo = {
          "type": "map"
        };

        chai.expect(JsonPollock.render.bind(JsonPollock, mapNoLaLo)).to.throw(SCHEMA_VALIDATION_ERR);
      });

      it('If element of type image is lack of mandatory properties (url) an invalid schema error should be triggered', function () {
        var imageNoUrl = {
          "type": "vertical",
          "elements": [{
            "type": "image",
            "caption": "This is an example of image caption",
            "tooltip": "image tooltip",
            "rtl": true
          }]
        };

        chai.expect(JsonPollock.render.bind(JsonPollock, imageNoUrl)).to.throw(SCHEMA_VALIDATION_ERR);
      });

      it('If action of type navigate is lack of mandatory properties (lo, la) an invalid schema error should be triggered', function () {
        var actionNoLo = {
          "type": "vertical",
          "elements": [{
            "type": "button",
            "title": "mytitle",
            "click": {
              "actions": [{
                "type": "navigate",
                "la": 2423423423
              }]
            },
            "tooltip": "button tooltip",
            "rtl": true
          }]
        };

        var actionNoLa = {
          "type": "vertical",
          "elements": [{
            "type": "button",
            "title": "mytitle",
            "click": {
              "actions": [{
                "type": "navigate",
                "lo": 2423423423
              }]
            },
            "tooltip": "button tooltip",
            "rtl": true
          }]
        };

        chai.expect(JsonPollock.render.bind(JsonPollock, actionNoLa)).to.throw(SCHEMA_VALIDATION_ERR);
      });

      it('If action of type link is lack of mandatory properties (uri) an invalid schema error should be triggered', function () {
        var actionNoUri = {
          "type": "vertical",
          "elements": [{
            "type": "button",
            "title": "mytitle",
            "click": {
              "actions": [{
                "type": "link"
              }]
            },
            "tooltip": "button tooltip",
            "rtl": true
          }]
        };

        chai.expect(JsonPollock.render.bind(JsonPollock, actionNoUri)).to.throw(SCHEMA_VALIDATION_ERR);
      });


    });

    describe('Unrecognized elements', function () {    
      it('If element is not recognized an invalid schema error should be triggered', function () {
        var json = {
          "type": "vertical",
          "elements": [{      
              "type": "text",
              "text": "foo"            
          },{
            "type": "blablabla",
            "text": "foo"            
          }]
        };
        chai.expect(JsonPollock.render.bind(JsonPollock, json)).to.throw(SCHEMA_VALIDATION_ERR);
      });
    });

    describe('Type checking', function () {

      describe('Click property of basic element', function () {

        it('actions must be of array type', function () {
          var actionsWithNonArrayVal = {
            "type": "vertical",
            "elements": [{
              "type": "button",
              "title": "mytitle",
              "click": {
                "actions": {
                  "type": "navigate",
                  "lo": 2423423423,
                  "la": 7897967267
                }
              },
              "tooltip": "button tooltip",
              "rtl": true
            }]
          };

          chai.expect(JsonPollock.render.bind(JsonPollock, actionsWithNonArrayVal)).to.throw(SCHEMA_VALIDATION_ERR);
        });

      });

      describe('Action of type navigation', function () {

        it('lo value must be integer', function () {
          var navigateLoString = {
            "type": "vertical",
            "elements": [{
              "type": "button",
              "title": "mytitle",
              "click": {
                "actions": [{
                  "type": "navigate",
                  "lo": "2423423423",
                  "la": 7897967267
                }]
              },
              "tooltip": "button tooltip",
              "rtl": true
            }]
          };

          chai.expect(JsonPollock.render.bind(JsonPollock, navigateLoString)).to.throw(SCHEMA_VALIDATION_ERR);
        });

        it('la value must be integer', function () {
          var navigateLaString = {
            "type": "vertical",
            "elements": [{
              "type": "button",
              "title": "mytitle",
              "click": {
                "actions": [{
                  "type": "navigate",
                  "lo": 2423423423,
                  "la": "7897967267"
                }]
              },              
              "tooltip": "button tooltip",
              "rtl": true
            }]
          };

          chai.expect(JsonPollock.render.bind(JsonPollock, navigateLaString)).to.throw(SCHEMA_VALIDATION_ERR);
        });

      });

      describe('Action of type link', function () {

        it('uri format check according to rfc', function () {
          var linkWrongUriNoProtocol = {
            "type": "vertical",
            "elements": [{
              "type": "button",
              "title": "mytitle",
              "click": {
                "actions": [{
                  "type": "link",
                  "uri": "www.example.com"
                }]
              },              
              "tooltip": "button tooltip",
              "rtl": true
            }]
          };

          chai.expect(JsonPollock.render.bind(JsonPollock, linkWrongUriNoProtocol)).to.throw(SCHEMA_VALIDATION_ERR);
        });

      });

    });

  });

});
