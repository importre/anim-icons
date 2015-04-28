import React from 'react'
import JSZip from 'jszip'
import Rx from 'rx'
import saveAs from 'filesaver.js'
import RSVP from 'rsvp'
import request from 'superagent'
import mui from 'material-ui'
import bs from 'react-bootstrap'
import ColorPicker from 'react-color-picker'

let Main = React.createClass({

  getInitialState: function () {
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

    return {
      title: 'Animated Icons',
      desc1: 'Animated icons implemented using AnimatedVectorDrawable.',
      color: '#2196F3',
      java: `<pre><code class="java">findViewById(R.id.b1).setOnClickListener(new View.OnClickListener() {
  @Override
  public void onClick(View v) {
    ((AnimatedButton) v).toggle();
  }
});

findViewById(R.id.b2).setOnClickListener(new View.OnClickListener() {
  @Override
  public void onClick(View v) {
    ((AnimatedButton) v).toggle();
  }
});</code></pre>`,
      layout: `<pre><code class="xml">&lt;io.github.importre.animatedicons.PlayPauseButton
    android:id=&quot;@+id/b1&quot;
    android:layout_width=&quot;48dp&quot;
    android:layout_height=&quot;48dp&quot;
    android:background=&quot;?attr/selectableItemBackgroundBorderless&quot; /&gt;

&lt;io.github.importre.animatedicons.ExpandMoreLessButton
    android:id=&quot;@+id/b2&quot;
    android:layout_width=&quot;48dp&quot;
    android:layout_height=&quot;48dp&quot;
    android:background=&quot;?attr/selectableItemBackgroundBorderless&quot; /&gt;</code></pre>`,
      gradle: `<pre><code class="groovy">dependencies {
  compile &apos;com.android.support:appcompat-v7:22.1.0&apos;
}</code></pre>`,
      files: files
    };
  },

  handleSubmit: function (e) {
    e.preventDefault();
    console.log('handleSubmit');

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

    var self = this;
    var zip = new JSZip();
    Rx.Observable
      .from(self.state.files)
      .selectMany(function (x) {
        return Rx.Observable.fromPromise(loadData(x[0], x[1]))
      })
      .subscribe(function (obj) {
        if (obj.name.endsWith('ai_colors.xml')) {
          obj.data = obj.data.replace('${color}', self.state.color);
          console.log(obj.data)
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
      color: value
    });
  },

  render: function () {
    var home = 'https://github.com/importre/anim-icons';
    var sample = 'https://github.com/importre/anim-icons/tree/master/sample';

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
              <a className="github-button" href="{home}"
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
            <bs.PageHeader>Usage</bs.PageHeader>

            <ul>
              <li>Set the color that you want</li>
              <mui.TextField hintText="Set your color"
                             ref="color"
                             onChange={this.handleChange}
                             defaultValue={this.state.color}/>

              <li>Click</li>
              <bs.Button onClick={this.handleSubmit} bsStyle='primary'>Download</bs.Button>

              <li>Unzip and copy <code>main</code> directory to your project</li>

              <li>Import <code>&lt;YOUR_PACKAGE&gt;.R</code> in <code>io&#47;github&#47;importre&#47;animatedicons&#47;
                *.java</code> if cannot resolve symbol
                '<code>R</code>'
              </li>

              <li>Make sure AppCompat version is <code>22.1.0</code> in <code>build.gradle</code></li>
              <div dangerouslySetInnerHTML={{__html: this.state.gradle}}/>

              <li>Add buttons to your layout</li>
              <div dangerouslySetInnerHTML={{__html: this.state.layout}}/>

              <li>Add listener and Invoke <code>toggle()</code></li>
              <div dangerouslySetInnerHTML={{__html: this.state.java}}/>
            </ul>
          </div>

          <div>
            <bs.PageHeader>SDK_INT &lt; LOLLIPOP</bs.PageHeader>

            <ul>
              <li>No animation</li>
              <li>The color is set by <code>DrawableCompat.setTint()</code></li>
            </ul>
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

export default Main;
