/* global window, Image, document, MouseEvent, FormData, XMLHttpRequest, FileReader, Blob */
/* eslint-disable class-methods-use-this, no-unused-expressions */

import 'swiper/dist/css/swiper.min.css';
import Swiper from 'swiper';

import Mads from './scripts/mads';
import { fadeOutIn, fadeIn, fadeOut } from './scripts/utils';

class AdUnit extends Mads {
  constructor() {
    super();
    this.bgIndex = 1;
    this.message = '';
    this.name = '';
    this.photo = null;
    this.stage = 1;
  }

  render() {
    return `<div class="container" id="container">
  <div id="firstScreen" class="screen">
    <img src="img/first%20screen.png" alt="">
    <img src="img/button%20mulai%20buat.png" alt="" id="s1Button">
  </div>
  <div id="secondScreen" class="screen">
    <canvas id="workspace" width="320" height="480"></canvas>
    <img src="img/pilih%20background.png" alt="" id="pilihBg">
    <div id="pickContainer">
      <div class="swiper-container">
        <div class="swiper-wrapper" id="picker">
        </div>
      </div>
    </div>
    <div id="fill">
      <img src="img/klik%20untuk%20isi%20pesan.png" alt="" id="message">
      <img src="img/klik%20upload%20fotoo.png" alt="" id="photo">
      <img src="img/klik%20nama%20kamu.png" alt="" id="name">
      <input type="file" id="upload" style="display: none;"/>
    </div>
    <div id="shareContainer">
      <img src="img/CTA%20share.png" alt="" id="share">
      <img src="img/twitter%20button.png" alt="" id="twitShare">
      <img src="img/FB%20button.png" alt="" id="fbShare">
      <img src="img/whatsapp%20button.png" alt="" id="whatsAppShare">
    </div>
    <div id="formContainer">
      <form id="form">
        <input type="text" placeholder="Nama*" name="nama" required>
        <input type="email" placeholder="Email*" name="email" required>
        <input type="text" placeholder="Kota*" name="kota" required>
        <input type="image" src="${this.resolve('img/submit%20button.png')}">
      </form>
    </div>
    <img src="img/pilih%20button.png" alt="" id="choose">
  </div>
</div>
    `;
  }

  renderCtx(bgIndex = this.bgIndex, message = this.message, name = this.name, photo = this.photo) {
    const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
      const words = text.split(' ');
      let line = '';
      let tmpY = y;

      for (let n = 0; n < words.length; n += 1) {
        const testLine = `${line}${words[n]} `;
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, tmpY);
          line = `${words[n]} `;
          tmpY += lineHeight;
        } else {
          line = testLine;
        }
      }
      context.fillText(line, x, tmpY);
    };

    this.ctx.clearRect(0, 0, this.elems.workspace.width, this.elems.workspace.height);
    const bg = new Image();
    bg.src = this.resolve(`img/bg${bgIndex}.png`);
    bg.onload = () => {
      const product = new Image();
      product.src = this.resolve('img/produk.png');
      product.onload = () => {
        this.ctx.drawImage(bg, 0, 0);
        this.ctx.drawImage(product, 0, 480 - 129);
        if (message) {
          this.ctx.font = '13px "Lucida Sans Unicode", "Lucida Grande", sans-serif';
          this.ctx.fillStyle = 'white';
          this.ctx.textAlign = 'center';
          wrapText(this.ctx, message, this.elems.workspace.width / 2, 155, 290, 16);
        }

        if (name) {
          this.ctx.font = '16px "Lucida Sans Unicode", "Lucida Grande", sans-serif';
          this.ctx.fillStyle = 'white';
          this.ctx.textAlign = 'center';
          wrapText(this.ctx, name, 225, 280, 170, 20);
        }

        if (photo) {
          this.ctx.save();
          this.ctx.translate(this.elems.workspace.width / 2, this.elems.workspace.height / 2);
          this.ctx.rotate((-7 * Math.PI) / 180);
          this.ctx.drawImage(photo, -135, -5, 88, 88);
          const border = new Image();
          border.src = this.resolve('img/frame%20border.png');
          border.onload = () => {
            this.ctx.fillStyle = 'white';
            this.ctx.drawImage(border, -144, -15);
            this.ctx.restore();
          };
        }
      };
    };
  }

  renderSecondScreen() {
    this.ctx = this.elems.workspace.getContext('2d');
    this.renderCtx();

    const iterate = (index = 1) => {
      const pick = new Image();
      pick.src = this.resolve(`img/template${index}.png`);
      pick.onload = () => {
        const div = document.createElement('div');
        div.className = 'swiper-slide';
        div.appendChild(pick);
        this.elems.picker.appendChild(div);
        if (index === 6) {
          Swiper('.swiper-container', {
            slidesPerView: 4,
            spaceBetween: 1,
            free: true,
            onClick: (swiper) => {
              this.tracker('E', 'change_bg');
              this.bgIndex = swiper.clickedIndex + 1;
              this.renderCtx(swiper.clickedIndex + 1);
            },
          });
        }

        if (index < 6) {
          const tmpIndex = index + 1;
          iterate(tmpIndex);
        }
      };
    };

    iterate();
  }

  style() {
    const links = [];
    const abs = 'position: absolute;';

    return [...links,
      `
      #rma-widget, #container, .screen {
        width: 320px;
        height: 480px;
      }
      
      #container, .screen {
        ${abs}
        left: 0;
        top: 0;
      }
      
      #secondScreen {
        display: none;
      }
      
      #fill {
        opacity: 0;
      }
      
      #s1Button {
        ${abs}
        bottom: 35px;
        left: 28px;
      }
      
      #pilihBg {
        ${abs}
        bottom: 0;
      }
      
      #choose {
        ${abs}
        bottom: 0;
      }
      
      #shareContainer {
        ${abs}
        bottom: 110px;
        right: 11px;
        z-index: 1;
        display: none;
      }
      
      #share {
        display: block;
        position: relative;
        left: 49px;
        top: 2px;
      }
      
      #formContainer {
        width: 320px;
        height: 480px;
        position: absolute;
        z-index: 11;
        left: 0;
        top: 0;
        background: url(${this.resolve('img/BG%20form.png')});
        display: none;
      }
      
      #form {
        position: absolute;
        top: 163px;
        width: 320px;
        text-align: center;
      }
      
      #formContainer input[type=text], #formContainer input[type=email] {
        width: 200px;
      }
      
      #formContainer input {
        display: block;
        padding-top: 5px;
        padding-bottom: 5px;
        font-size: 14px;
        text-align: center;
        border-radius: 5px;
        margin: 0 auto;
        margin-bottom: 7px;
      }
      
      #message {
        ${abs}
        top: 140px;
        left: 13px;
      }
      
      #photo {
        ${abs}
        top: 240px;
        left: 22px;
      }
      
      #name {
        ${abs}
        top: 250px;
        right: 14px;
      }
      
      #pickContainer {
        ${abs}
        bottom: 30px;
        width: 310px;
        margin-left: 4px;
        margin-right: 4px;
      }
      
      #product {
        ${abs}
        bottom: 0;
        display: none;
      }
      
      .swiper-container {
        width: 100%;
        height: 100%;
      }
      
      .swiper-slide {
        text-align: center;
        font-size: 18px;
        
        /* Center slide text vertically */
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
      }
      
      ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  color: #004609;
}
::-moz-placeholder { /* Firefox 19+ */
  color: #004609;
}
:-ms-input-placeholder { /* IE 10+ */
  color: #004609;
}
:-moz-placeholder { /* Firefox 18- */
  color: #004609;
}
      `];
  }

  uploadHTML(timestamp, info) {
    const title = info.name;
    const description = info.desc;
    const image = info.url;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta property="og:type" content="image">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="http://www.ahlinyalambung.com/id-id/">
  <meta name="twitter:site" content="@ahlinya_lambung">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:creator" content="@ahlinya_lambung">
  <meta name="twitter:image" content="${image}">
  <meta name="twitter:domain" content="www.ahlinyalambung.com">
  <meta name="description" content="${description}">
  <meta name="DC.title" content="${title}"> <!-- Latest compiled and minified CSS -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
        integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
  <style> /* Space out content a bit */
  body {
    padding-top: 20px;
    padding-bottom: 20px;
  }

  /* Everything but the jumbotron gets side spacing for mobile first views */
  .header, .marketing, .footer {
    padding-right: 15px;
    padding-left: 15px;
  }

  /* Custom page header */
  .header {
    padding-bottom: 20px;
    border-bottom: 1px solid #e5e5e5;
  }

  /* Make the masthead heading the same height as the navigation */
  .header h3 {
    margin-top: 0;
    margin-bottom: 0;
    line-height: 40px;
  }

  /* Custom page footer */
  .footer {
    padding-top: 19px;
    color: #777;
    border-top: 1px solid #e5e5e5;
  }

  /* Customize container */
  @media (min-width: 768px) {
    .container {
      max-width: 730px;
    }
  }

  .container-narrow > hr {
    margin: 30px 0;
  }

  /* Main marketing message and sign up button */
  .jumbotron {
    text-align: center;
    border-bottom: 1px solid #e5e5e5;
  }

  .jumbotron .btn {
    padding: 14px 24px;
    font-size: 21px;
  }

  /* Supporting marketing content */
  .marketing {
    margin: 40px 0;
  }

  .marketing p + h4 {
    margin-top: 28px;
  }

  /* Responsive: Portrait tablets and up */
  @media screen and (min-width: 768px) {
    /* Remove the padding we set earlier */
    .header, .marketing, .footer {
      padding-right: 0;
      padding-left: 0;
    }

    /* Space out the masthead */
    .header {
      margin-bottom: 30px;
    }

    /* Remove the bottom border on the jumbotron for visual effect */
    .jumbotron {
      border-bottom: 0;
    }
  } </style>
</head>
<body>
<div class="container">
  <div class="jumbotron">
    <div class="row marketing"><img src="${image}" alt="${title}" class="img-responsive">
      <h1 class="title" style="word-wrap:break-word">${title}</h1>
      <p class="description" style="word-wrap:break-word">${description}</p>
      <!--<p><strong>You'll be redirected to our site. Please wait for 5 seconds.</strong></p>--></div>
  </div>
</div> <!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
        integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"
        crossorigin="anonymous"></script>
</body>
</html>
`;

    return new Promise((resolve, reject) => {
      const data = new FormData();

      try {
        data.append('pic[]', new Blob([html], { type: 'text/html' }));
        data.append('path', `2901/custom/promag/uploads/${info.name}-${timestamp}`);
        data.append('name', 'index.html');

        const xhr = new XMLHttpRequest();

        xhr.addEventListener('readystatechange', () => {
          if (xhr.readyState === 4) {
            this.tracker('E', 'created_card');
            resolve(`https://rmarepo.richmediaads.com/2901/custom/promag/uploads/${info.name}-${timestamp}/index.html`);
          }
        });

        xhr.open('POST', 'https://www.mobileads.com/upload-image-twtbk');
        xhr.setRequestHeader('cache-control', 'no-cache');

        xhr.send(data);
      } catch (e) {
        reject(e);
      }
    });
  }

  uploadImage(b, info) {
    return new Promise((resolve, reject) => {
      const timestamp = Math.floor(Date.now() / 1000);
      const data = new FormData();

      try {
        const n = info.name.replace(/\s/g, '.');
        const fileName = `${n}-${timestamp}.png`;
        data.append('pic[]', b);
        data.append('path', `2901/custom/promag/uploads/${n}-${timestamp}`);
        data.append('name', fileName);

        const xhr = new XMLHttpRequest();

        xhr.addEventListener('readystatechange', () => {
          if (xhr.readyState === 4) {
            this.uploadHTML(timestamp, {
              name: n,
              desc: this.message,
              url: `https://rmarepo.richmediaads.com/2901/custom/promag/uploads/${n}-${timestamp}/${fileName}`,
            }).then((urlToIndex) => {
              this.urlToIndex = urlToIndex;
              resolve({ fileName, urlToIndex });
            });
          }
        });

        xhr.open('POST', 'https://www.mobileads.com/upload-image-twtbk');
        xhr.setRequestHeader('cache-control', 'no-cache');

        xhr.send(data);
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  }

  events() {
    this.elems.s1Button.addEventListener('click', () => {
      this.renderSecondScreen();
      this.tracker('E', 'first_click');
      fadeOutIn(this.elems.firstScreen, this.elems.secondScreen);
    });

    this.elems.photo.addEventListener('click', () => {
      const event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      });

      const cancelled = !this.elems.upload.dispatchEvent(event);
      if (cancelled) {
        // A handler called preventDefault.
        console.log('cancelled');
      } else {
        // None of the handlers called preventDefault.
        console.log('not cancelled');
      }
    });

    this.elems.upload.onclick = function () {
      this.value = null;
    };

    this.elems.upload.onchange = () => {
      const file = this.elems.upload.files[0];
      if (file) {
        if (FileReader) {
          const fileReader = new FileReader();
          fileReader.onload = () => {
            const img = new Image();
            img.src = fileReader.result;
            this.photo = img;
            this.renderCtx(this.bgIndex, this.message, this.name, img);
            this.elems.photo.style.display = 'none';
          };
          fileReader.readAsDataURL(file);
        }
      }
    };

    this.elems.fbShare.onclick = () => {
      this.generateShortUrl(this.urlToIndex).then((url) => {
        this.shortUrl = JSON.parse(url).id;
        const tmpUrl = encodeURIComponent(this.shortUrl);

        this.tracker('E', 'share_fb');
        this.linkOpener(`https://www.facebook.com/sharer/sharer.php?u=${tmpUrl}`);
      });
    };

    this.elems.twitShare.onclick = () => {
      this.generateShortUrl(this.urlToIndex).then((url) => {
        this.shortUrl = JSON.parse(url).id;

        const referrer = encodeURIComponent('http://www.ahlinyalambung.com/id-id/');
        const msg = encodeURIComponent(this.message);
        const tmpUrl = encodeURIComponent(this.shortUrl);

        this.tracker('E', 'share_twitter');
        this.linkOpener(`https://twitter.com/intent/tweet?text=${msg}&original_referrer=${referrer}&url=${tmpUrl}&tw_p=tweetbutton&via=ahlinya_lambung`);
      });
    };

    this.elems.whatsAppShare.onclick = () => {
      this.generateShortUrl(this.urlToIndex).then((url) => {
        this.shortUrl = JSON.parse(url).id;

        const anchor = document.createElement('a');
        anchor.href = `whatsapp://send?text=Kartu Lebaran dari Kerabatmu, oleh Promag Ahlinya Lambung ${this.shortUrl}`;
        anchor.setAttribute('style', 'position: absolute; left: -999px; top: -999px; height: 0; width: 0;');

        const event = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
        });

        const cancelled = !anchor.dispatchEvent(event);
        if (cancelled) {
          // A handler called preventDefault.
          console.log('cancelled');
        } else {
          // None of the handlers called preventDefault.
          console.log('not cancelled');
        }

        this.tracker('E', 'share_whatsapp');
      });
    };

    this.elems.message.addEventListener('click', () => {
      this.message = window.prompt('Pesan', 'Anything');
      if (this.message) {
        this.renderCtx(this.bgIndex, this.message, this.name, this.photo);
        this.elems.message.style.display = 'none';
        this.tracker('E', 'enter_msg');
      }
    });

    this.elems.form.onsubmit = () => {
      const form = this.elems.form;
      // MW OFFDECK - let url = 'https://www.mobileads.com/api/save_lf?contactEmail=jeff@mobileads.com,dickale@imx.co.id,karima@imx.co.id&gotDatas=1&element=[{%22fieldname%22:%22text_1%22,%22value%22:%22nama%22,%22required%22:%22required%22},{%22fieldname%22:%22text_2%22,%22value%22:%22email_field%22,%22required%22:%22required%22},{%22fieldname%22:%22text_3%22,%22value%22:%22kota%22,%22required%22:%22required%22}]&user-id=2901&studio-id=420&tab-id=1&trackid=2258&referredURL=Sample%20Ad%20Unit&callback=leadGenCallback';
      // MW BIDSTALK - let url = 'https://www.mobileads.com/api/save_lf?contactEmail=jeff@mobileads.com,dickale@imx.co.id,karima@imx.co.id&gotDatas=1&element=[{%22fieldname%22:%22text_1%22,%22value%22:%22nama%22,%22required%22:%22required%22},{%22fieldname%22:%22text_2%22,%22value%22:%22email_field%22,%22required%22:%22required%22},{%22fieldname%22:%22text_3%22,%22value%22:%22kota%22,%22required%22:%22required%22}]&user-id=2901&studio-id=422&tab-id=1&trackid=2259&referredURL=Sample%20Ad%20Unit&callback=leadGenCallback';
      // IA BIDSTALK -
      let url = 'https://www.mobileads.com/api/save_lf?contactEmail=jeff@mobileads.com,dickale@imx.co.id,karima@imx.co.id&gotDatas=1&element=[{%22fieldname%22:%22text_1%22,%22value%22:%22nama%22,%22required%22:%22required%22},{%22fieldname%22:%22text_2%22,%22value%22:%22email_field%22,%22required%22:%22required%22},{%22fieldname%22:%22text_3%22,%22value%22:%22kota%22,%22required%22:%22required%22}]&user-id=2901&studio-id=423&tab-id=1&trackid=2260&referredURL=http://www.mobileads.com/preview/mobile.html&callback=leadGenCallback';
      this.generateShortUrl(this.urlToIndex).then((_url) => {
        this.shortUrl = JSON.parse(_url).id;

        url = url.replace(/nama/, `${form.nama.value} - ${this.shortUrl}`);
        url = url.replace(/email_field/, form.email.value);
        url = url.replace(/kota/, form.kota.value);
        this.loadJS(url);
        this.tracker('E', 'form_submit');
        fadeOut(this.elems.formContainer);
      });

      return false;
    };

    this.elems.name.addEventListener('click', () => {
      this.name = window.prompt('Nama', 'John Doe');
      if (this.name) {
        this.renderCtx(this.bgIndex, this.message, this.name, this.photo);
        this.elems.name.style.display = 'none';
        this.tracker('E', 'enter_name');
      }
    });

    this.elems.choose.addEventListener('click', () => {
      switch (this.stage) {
        case 1: {
          this.elems.fill.style.opacity = 1;
          this.stage = 2;
          this.tracker('E', 'choose_bg');
          break;
        }
        case 2: {
          if (!this.message || !this.name || !this.photo) {
            window.alert('Please fill in the details.');
          } else {
            this.tracker('E', 'finish_details');

            this.elems.choose.style.opacity = 0.5;
            this.elems.choose.style.pointerEvents = 'none';
            this.elems.workspace.toBlob((blob) => {
              this.uploadImage(blob, { name: this.name }).then(() => {
                this.elems.choose.style.display = 'none';
                this.elems.pilihBg.style.display = 'none';
                this.elems.pickContainer.style.display = 'none';
                fadeIn(this.elems.formContainer);
                fadeIn(this.elems.shareContainer);
              }).catch(() => {
                this.elems.choose.style.opacity = 1;
                this.elems.choose.style.pointerEvents = 'auto';
              });
              window.setTimeout(() => {
                this.elems.choose.style.opacity = 1;
                this.elems.choose.style.pointerEvents = 'auto';
              }, 10000);
            });
          }
          break;
        }
        default: {
          // Implement Nothing
        }
      }
    });
  }
}

window.ad = new AdUnit();
