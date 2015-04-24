/*
 * Copyright (c) 2015, Jaewe Heo. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

package io.github.importre.animatedicons;

import android.content.Context;
import android.util.AttributeSet;


public class PlayPauseButton extends AnimatedButton {

    public PlayPauseButton(Context context) {
        super(context);
    }

    public PlayPauseButton(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected int getOnDrawable() {
        if (isLollipop()) {
            return R.drawable.ai_drawable_pause_to_play;
        }

        return R.drawable.ic_av_play;
    }

    @Override
    protected int getOffDrawable() {
        if (isLollipop()) {
            return R.drawable.ai_drawable_play_to_pause;
        }

        return R.drawable.ic_av_pause;
    }
}
