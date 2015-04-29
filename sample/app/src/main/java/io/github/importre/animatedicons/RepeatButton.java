/*
 * Copyright (c) 2015, Jaewe Heo. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

package io.github.importre.animatedicons;

import android.content.Context;
import android.util.AttributeSet;


public class RepeatButton extends AnimatedButton {

    public RepeatButton(Context context) {
        super(context);
    }

    public RepeatButton(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected int getOnDrawable() {
        if (isLollipop()) {
            return R.drawable.ai_drawable_one_to_repeat;
        }

        return R.drawable.ic_av_repeat;
    }

    @Override
    protected int getOffDrawable() {
        if (isLollipop()) {
            return R.drawable.ai_drawable_repeat_to_one;
        }

        return R.drawable.ic_av_repeat_one;
    }
}
