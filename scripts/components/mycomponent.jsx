import React from 'react'
import JSZip from 'jszip'
import Rx from 'rx'
import saveAs from 'filesaver.js'
import RSVP from 'rsvp'
import request from 'superagent'
import pack from '../../package.json'

let Mycomponent = React.createClass({
  render: function() {
    let version = pack.version,
        deps;

    deps = Object.keys(pack.devDependencies).map((dep, i) => <li key={i}>{dep}</li>);

    var getData = function(url, mime) {
      var promise = new RSVP.Promise(function(resolve, reject){
         request
         .get(url)
         .on('request', function () {
           if (mime.startsWith('image')) {
             this.xhr.responseType = 'arraybuffer';
           }
         })
         .set({Accept: mime})
         .end(function(err, res){
           if (err) {
             reject(err)
           } else {
             resolve({
               name: url,
               data: mime.startsWith('image/') ? res.xhr.response : res.text
             })
           }
         });
      });

      return promise;
    };


    var zip = new JSZip();
    var files = [
      ['main/res/drawable-hdpi/ic_av_pause.png', 'image/png'],
      ['main/res/drawable-hdpi/ic_av_play.png', 'image/png'],
      ['main/res/drawable-hdpi/ic_navigation_expand_less.png', 'image/png'],
      ['main/res/drawable-hdpi/ic_navigation_expand_more.png', 'image/png'],
      ['main/res/drawable-mdpi/ic_av_pause.png', 'image/png'],
      ['main/res/drawable-mdpi/ic_av_play.png', 'image/png'],
      ['main/res/drawable-mdpi/ic_navigation_expand_less.png', 'image/png'],
      ['main/res/drawable-mdpi/ic_navigation_expand_more.png', 'image/png'],
      ['main/res/drawable-xhdpi/ic_av_pause.png', 'image/png'],
      ['main/res/drawable-xhdpi/ic_av_play.png', 'image/png'],
      ['main/res/drawable-xhdpi/ic_navigation_expand_less.png', 'image/png'],
      ['main/res/drawable-xhdpi/ic_navigation_expand_more.png', 'image/png'],
      ['main/res/drawable-xxhdpi/ic_av_pause.png', 'image/png'],
      ['main/res/drawable-xxhdpi/ic_av_play.png', 'image/png'],
      ['main/res/drawable-xxhdpi/ic_navigation_expand_less.png', 'image/png'],
      ['main/res/drawable-xxhdpi/ic_navigation_expand_more.png', 'image/png'],
      ['main/res/drawable-xxxhdpi/ic_av_pause.png', 'image/png'],
      ['main/res/drawable-xxxhdpi/ic_av_play.png', 'image/png'],
      ['main/res/drawable-xxxhdpi/ic_navigation_expand_less.png', 'image/png'],
      ['main/res/drawable-xxxhdpi/ic_navigation_expand_more.png', 'image/png'],
      ['main/java/io/github/importre/animatedicons/LICENSE', 'text/plain'],
      ['main/java/io/github/importre/animatedicons/AnimatedButton.java', 'text/plain'],
      ['main/java/io/github/importre/animatedicons/ExpandMoreLessButton.java', 'text/plain'],
      ['main/java/io/github/importre/animatedicons/PlayPauseButton.java', 'text/plain'],
      ['main/res/anim/ai_anim_expand_less_to_more.xml', 'application/xml'],
      ['main/res/anim/ai_anim_expand_more_to_less.xml', 'application/xml'],
      ['main/res/anim/ai_anim_pause_to_play.xml', 'application/xml'],
      ['main/res/anim/ai_anim_play_to_pause.xml', 'application/xml'],
      ['main/res/drawable-v21/ai_drawable_expand_less.xml', 'application/xml'],
      ['main/res/drawable-v21/ai_drawable_expand_less_to_more.xml', 'application/xml'],
      ['main/res/drawable-v21/ai_drawable_expand_more.xml', 'application/xml'],
      ['main/res/drawable-v21/ai_drawable_expand_more_to_less.xml', 'application/xml'],
      ['main/res/drawable-v21/ai_drawable_pause.xml', 'application/xml'],
      ['main/res/drawable-v21/ai_drawable_pause_to_play.xml', 'application/xml'],
      ['main/res/drawable-v21/ai_drawable_play.xml', 'application/xml'],
      ['main/res/drawable-v21/ai_drawable_play_to_pause.xml', 'application/xml'],
      ['main/res/values/ai_colors.xml', 'application/xml'],
      ['main/res/values/ai_av_path.xml', 'application/xml'],
      ['main/res/values/ai_navigation_path.xml', 'application/xml']
    ];

    Rx.Observable
    .from(files)
    .selectMany(function (x) {
      return Rx.Observable.fromPromise(getData(x[0], x[1]))
    })
    .subscribe(
      function (obj) {
        if (obj.name.endsWith('ai_colors.xml')) {
          obj.data = obj.data.replace('${color}', '#2196F3')
        }
        zip.file(obj.name, obj.data);
      }, function (err) {
        console.log(err);
      }, function () {
        console.log('done');
        /*
        var content = zip.generate({type:"blob"});
        saveAs(content, "anim-icons.zip");
        */
      }
    );

    return (
      <div>
        <h1 className="Mycomponent">Welcome to &#9883; React Starterify {version}</h1>
        <p>Powered by:</p>
        <ul>
          {deps}
        </ul>
      </div>
    )
  }
});

export default Mycomponent;
