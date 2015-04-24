/*
 * Copyright (c) 2015, Jaewe Heo. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

package io.github.importre.animatedicons;

import android.content.Context;
import android.util.AttributeSet;


public class ExpandMoreLessButton extends AnimatedButton {

    public ExpandMoreLessButton(Context context) {
        super(context);
    }

    public ExpandMoreLessButton(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    protected int getOnDrawable() {
        if (isLollipop()) {
            return R.drawable.ai_drawable_expand_more_to_less;
        }

        return R.drawable.ic_navigation_expand_less;
    }

    @Override
    protected int getOffDrawable() {
        if (isLollipop()) {
            return R.drawable.ai_drawable_expand_less_to_more;
        }

        return R.drawable.ic_navigation_expand_more;
    }
}
