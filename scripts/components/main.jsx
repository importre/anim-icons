import React from 'react'
import JSZip from 'jszip'
import Rx from 'rx'
import saveAs from 'filesaver.js'
import RSVP from 'rsvp'
import request from 'superagent'
import mui from 'material-ui'
import bs from 'react-bootstrap'
import ColorPicker from 'react-colorpickr'


let Main = React.createClass({

  getInitialState: function () {
    var defaultColor = '#2196F3';
    return {
      title: 'Animated Icons',
      desc1: 'Animated icons implemented using AnimatedVectorDrawable.',
      color: defaultColor,
      color1: defaultColor,
      commonFiles: commonFiles,
      playPauseFiles: playPauseFiles,
      expandMoreLessFiles: expandMoreLessFiles,
      repeatOneFiles: repeatOneFiles,
      gradle: gradleExample,
      java: javaExample,
      layout: layoutExample
    };
  },

  download: function (e) {
    e.preventDefault();

    var loadData = function (url, mime) {
      return new RSVP.Promise(function (resolve, reject) {
        request
          .get(url)
          .on('request', function () {
            if (mime.startsWith('image')) {
              this.xhr.responseType = 'arraybuffer';
            }
          })
          .set({Accept: mime})
          .end(function (err, res) {
            if (err) {
              reject(err);
            } else {
              resolve({
                name: url,
                data: mime.startsWith('image/') ? res.xhr.response : res.text
              });
            }
          });
      });
    };

    var files = [];
    files = files.concat(this.state.commonFiles);
    if (this.refs.playPause.isChecked())
      files = files.concat(this.state.playPauseFiles);
    if (this.refs.expandMoreLess.isChecked())
      files = files.concat(this.state.expandMoreLessFiles);
    if (this.refs.repeatOne.isChecked())
      files = files.concat(this.state.repeatOneFiles);

    var self = this;
    var zip = new JSZip();
    Rx.Observable
      .from(files)
      .selectMany(function (x) {
        return Rx.Observable.fromPromise(loadData(x[0], x[1]))
      })
      .subscribe(function (obj) {
        if (obj.name.endsWith('ai_colors.xml')) {
          obj.data = obj.data.replace('#2196F3', self.state.color);
        }
        zip.file(obj.name, obj.data);
      }, function (err) {
        console.log(err);
      }, function () {
        var content = zip.generate({type: "blob"});
        saveAs(content, "anim-icons.zip");
      }
    );
  },

  handleChange: function (e) {
    var value = this.refs.color.getValue();
    if (!value) value = '#2196F3';
    this.setState({
      color: value,
      color1: value
    });
  },

  onChange: function (color) {
    var value = '#' + color.hex;
    this.refs.color.setValue(value);
    this.setState({
      color: value,
      color1: value
    });
  },

  render: function () {
    var home = 'https://github.com/importre/anim-icons';
    var sample = home + '/tree/master/sample';

    return (
      <div>
        <bs.Navbar brand={this.state.title} toggleNavKey={0}>
          <bs.Nav right eventKey={0}>
            <bs.NavItem eventKey={1} href={home}>Fork on Github</bs.NavItem>
          </bs.Nav>
        </bs.Navbar>

        <div className="container">
          <bs.Jumbotron>
            <h1>{this.state.title}</h1>

            <p>{this.state.desc1}</p>

            <div>
              <a className="github-button" href="https://github.com/importre/anim-icons" data-icon="octicon-star"
                 data-count-href="/importre/anim-icons/stargazers"
                 data-count-api="/repos/importre/anim-icons#stargazers_count"
                 data-count-aria-label="# stargazers on GitHub" aria-label="Star importre/anim-icons on GitHub">Star</a>
              <br/>

              <div className="g-plusone" data-size="medium" data-href="http://importre.github.io/anim-icons/"></div>
            </div>

            <div className="fb-like" data-href="http://importre.github.io/anim-icons/" data-layout="button_count"
                 data-action="like" data-show-faces="true" data-share="true"></div>
          </bs.Jumbotron>

          <div>
            <bs.PageHeader>Usage</bs.PageHeader>

            <ul>
              <li>Select the color that you want</li>
              <ColorPicker
                ref="picker"
                value={this.state.color1}
                onChange={this.onChange}/>

              <mui.TextField hintText="Set your color"
                             ref="color"
                             onChange={this.handleChange}
                             defaultValue={this.state.color}/>


              <li>Select icons and Click <b>Download</b> button</li>
              <mui.Checkbox
                defaultSwitched={true}
                ref="playPause"
                label="play & pause (PlayPauseButton.java)" />

              <mui.Checkbox
                defaultSwitched={true}
                ref="expandMoreLess"
                label="expand more & less (ExpandMoreLessButton.java)" />

              <mui.Checkbox
                defaultSwitched={true}
                ref="repeatOne"
                label="repeat & repeat one (RepeatButton.java)" />
              <bs.Button onClick={this.download} bsStyle='danger'>Download</bs.Button>

              <li>Unzip and copy <code>app/src/main</code> directory to your project</li>

              <li>Import <code>&lt;YOUR_PACKAGE&gt;.R</code> in <code>io&#47;github&#47;importre&#47;animatedicons&#47;*.java</code> if cannot resolve symbol
                '<code>R</code>'
              </li>

              <li>Make sure AppCompat version is <code>22.1.0</code> in <code>build.gradle</code></li>
              <div dangerouslySetInnerHTML={{__html: this.state.gradle}}/>

              <li>Add a button that you want to your layout</li>
              <div dangerouslySetInnerHTML={{__html: this.state.layout}}/>

              <li>Add listener and Invoke <code>toggle()</code></li>
              <div dangerouslySetInnerHTML={{__html: this.state.java}}/>
            </ul>
          </div>

          <div>
            <bs.PageHeader>SDK_INT &lt; LOLLIPOP</bs.PageHeader>

            <ul>
              <li>No animations</li>
              <li>The color is set by <code>DrawableCompat.setTint()</code></li>
            </ul>
          </div>

          <div>
            <bs.PageHeader>Demo</bs.PageHeader>
            <div className="text-center">
              <iframe width="315" height="315"
                      src="https://www.youtube.com/embed/HGoS70fJ1-w"
                      frameBorder="0"
                      allowFullScreen>
              </iframe>
            </div>
          </div>

          <div>
            <bs.PageHeader>Sample</bs.PageHeader>
            <ul>
              <li><a href={sample}>{sample}</a>
              </li>
            </ul>
          </div>

          <div>
            <bs.PageHeader>License</bs.PageHeader>
            <ul>
              <li>BSD</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
});

var commonFiles = [
  ['sample/app/src/main/res/values/ai_colors.xml', 'application/xml'],
  ['sample/app/src/main/java/io/github/importre/animatedicons/LICENSE', 'text/plain'],
  ['sample/app/src/main/java/io/github/importre/animatedicons/AnimatedButton.java', 'text/plain']
];

var playPauseFiles = [
  // png drawable
  ['sample/app/src/main/res/drawable-hdpi/ic_av_pause.png', 'image/png'],
  ['sample/app/src/main/res/drawable-hdpi/ic_av_play.png', 'image/png'],
  ['sample/app/src/main/res/drawable-mdpi/ic_av_pause.png', 'image/png'],
  ['sample/app/src/main/res/drawable-mdpi/ic_av_play.png', 'image/png'],
  ['sample/app/src/main/res/drawable-xhdpi/ic_av_pause.png', 'image/png'],
  ['sample/app/src/main/res/drawable-xhdpi/ic_av_play.png', 'image/png'],
  ['sample/app/src/main/res/drawable-xxhdpi/ic_av_pause.png', 'image/png'],
  ['sample/app/src/main/res/drawable-xxhdpi/ic_av_play.png', 'image/png'],
  ['sample/app/src/main/res/drawable-xxxhdpi/ic_av_pause.png', 'image/png'],
  ['sample/app/src/main/res/drawable-xxxhdpi/ic_av_play.png', 'image/png'],

  // xml drawable
  ['sample/app/src/main/res/drawable-v21/ai_drawable_pause.xml', 'application/xml'],
  ['sample/app/src/main/res/drawable-v21/ai_drawable_pause_to_play.xml', 'application/xml'],
  ['sample/app/src/main/res/drawable-v21/ai_drawable_play.xml', 'application/xml'],
  ['sample/app/src/main/res/drawable-v21/ai_drawable_play_to_pause.xml', 'application/xml'],

  // anim
  ['sample/app/src/main/res/anim/ai_anim_pause_to_play.xml', 'application/xml'],
  ['sample/app/src/main/res/anim/ai_anim_play_to_pause.xml', 'application/xml'],

  // av path
  ['sample/app/src/main/res/values/ai_av_path.xml', 'application/xml'],

  // java
  ['sample/app/src/main/java/io/github/importre/animatedicons/PlayPauseButton.java', 'text/plain']
];

var expandMoreLessFiles = [
  // png drawable
  ['sample/app/src/main/res/drawable-hdpi/ic_navigation_expand_less.png', 'image/png'],
  ['sample/app/src/main/res/drawable-hdpi/ic_navigation_expand_more.png', 'image/png'],
  ['sample/app/src/main/res/drawable-mdpi/ic_navigation_expand_less.png', 'image/png'],
  ['sample/app/src/main/res/drawable-mdpi/ic_navigation_expand_more.png', 'image/png'],
  ['sample/app/src/main/res/drawable-xhdpi/ic_navigation_expand_less.png', 'image/png'],
  ['sample/app/src/main/res/drawable-xhdpi/ic_navigation_expand_more.png', 'image/png'],
  ['sample/app/src/main/res/drawable-xxhdpi/ic_navigation_expand_less.png', 'image/png'],
  ['sample/app/src/main/res/drawable-xxhdpi/ic_navigation_expand_more.png', 'image/png'],
  ['sample/app/src/main/res/drawable-xxxhdpi/ic_navigation_expand_less.png', 'image/png'],
  ['sample/app/src/main/res/drawable-xxxhdpi/ic_navigation_expand_more.png', 'image/png'],

  // xml drawable
  ['sample/app/src/main/res/anim/ai_anim_expand_less_to_more.xml', 'application/xml'],
  ['sample/app/src/main/res/anim/ai_anim_expand_more_to_less.xml', 'application/xml'],

  // anim
  ['sample/app/src/main/res/drawable-v21/ai_drawable_expand_less.xml', 'application/xml'],
  ['sample/app/src/main/res/drawable-v21/ai_drawable_expand_less_to_more.xml', 'application/xml'],
  ['sample/app/src/main/res/drawable-v21/ai_drawable_expand_more.xml', 'application/xml'],
  ['sample/app/src/main/res/drawable-v21/ai_drawable_expand_more_to_less.xml', 'application/xml'],

  // navigation path
  ['sample/app/src/main/res/values/ai_navigation_path.xml', 'application/xml'],

  // java
  ['sample/app/src/main/java/io/github/importre/animatedicons/ExpandMoreLessButton.java', 'text/plain']
];

var repeatOneFiles = [
  // png drawable
  ['sample/app/src/main/res/drawable-hdpi/ic_av_repeat.png', 'image/png'],
  ['sample/app/src/main/res/drawable-hdpi/ic_av_repeat_one.png', 'image/png'],
  ['sample/app/src/main/res/drawable-mdpi/ic_av_repeat.png', 'image/png'],
  ['sample/app/src/main/res/drawable-mdpi/ic_av_repeat_one.png', 'image/png'],
  ['sample/app/src/main/res/drawable-xhdpi/ic_av_repeat.png', 'image/png'],
  ['sample/app/src/main/res/drawable-xhdpi/ic_av_repeat_one.png', 'image/png'],
  ['sample/app/src/main/res/drawable-xxhdpi/ic_av_repeat.png', 'image/png'],
  ['sample/app/src/main/res/drawable-xxhdpi/ic_av_repeat_one.png', 'image/png'],
  ['sample/app/src/main/res/drawable-xxxhdpi/ic_av_repeat.png', 'image/png'],
  ['sample/app/src/main/res/drawable-xxxhdpi/ic_av_repeat_one.png', 'image/png'],

  // xml drawable
  ['sample/app/src/main/res/anim/ai_anim_repeat_to_one.xml', 'application/xml'],
  ['sample/app/src/main/res/anim/ai_anim_one_to_repeat.xml', 'application/xml'],

  // anim
  ['sample/app/src/main/res/drawable-v21/ai_drawable_repeat.xml', 'application/xml'],
  ['sample/app/src/main/res/drawable-v21/ai_drawable_repeat_to_one.xml', 'application/xml'],
  ['sample/app/src/main/res/drawable-v21/ai_drawable_repeat_one.xml', 'application/xml'],
  ['sample/app/src/main/res/drawable-v21/ai_drawable_one_to_repeat.xml', 'application/xml'],

  // navigation path
  ['sample/app/src/main/res/values/ai_av_path.xml', 'application/xml'],

  // java
  ['sample/app/src/main/java/io/github/importre/animatedicons/RepeatButton.java', 'text/plain']
];

var gradleExample = `<pre><code class="groovy">dependencies {
  compile &apos;com.android.support:appcompat-v7:22.1.0&apos;
}</code></pre>`;

var javaExample = `<pre><code class="java">findViewById(R.id.b1).setOnClickListener(new View.OnClickListener() {
  @Override
  public void onClick(View v) {
    ((AnimatedButton) v).toggle();
  }
});</code></pre>`;

var layoutExample = `<pre><code class="xml">&lt;io.github.importre.animatedicons.PlayPauseButton
    android:id=&quot;@+id/b1&quot;
    android:layout_width=&quot;48dp&quot;
    android:layout_height=&quot;48dp&quot;
    android:background=&quot;?attr/selectableItemBackgroundBorderless&quot; /&gt;</code></pre>`;

export default Main;
