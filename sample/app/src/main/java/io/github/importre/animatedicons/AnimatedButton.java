/*
 * Copyright (c) 2015, Jaewe Heo. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

package io.github.importre.animatedicons;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.res.Resources;
import android.graphics.drawable.Animatable;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.support.v4.graphics.drawable.DrawableCompat;
import android.util.AttributeSet;
import android.widget.ImageButton;


public abstract class AnimatedButton extends ImageButton {

    protected boolean checked;
    private Drawable offDrawable;
    private Drawable onDrawable;

    public AnimatedButton(Context context) {
        super(context);
        init(context);
    }

    public AnimatedButton(Context context, AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    @SuppressLint("NewApi")
    private void init(Context context) {
        if (isLollipop()) {
            offDrawable = context.getDrawable(getOffDrawable());
            onDrawable = context.getDrawable(getOnDrawable());
        } else {
            Resources r = context.getResources();

            offDrawable = r.getDrawable(getOffDrawable());
            onDrawable = r.getDrawable(getOnDrawable());
            offDrawable = DrawableCompat.wrap(offDrawable);
            onDrawable = DrawableCompat.wrap(onDrawable);

            int color = r.getColor(R.color.ai_primary);
            DrawableCompat.setTint(offDrawable, color);
            DrawableCompat.setTint(onDrawable, color);
        }

        setScaleType(ScaleType.CENTER_INSIDE);

        if (isLollipop()) {
            setImageDrawable(!checked ? onDrawable : offDrawable);
        } else {
            setImageDrawable(checked ? onDrawable : offDrawable);
        }
    }

    protected abstract int getOnDrawable();

    protected abstract int getOffDrawable();

    protected boolean isLollipop() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP;
    }

    /**
     * Change the checked state of the view to the inverse of its current state
     */
    public void toggle() {
        checked = !checked;
        setImageDrawable(checked ? onDrawable : offDrawable);

        if (isLollipop()) {
            Drawable drawable = getDrawable();
            if (drawable instanceof Animatable) {
                Animatable animatable = (Animatable) drawable;
                if (animatable.isRunning()) {
                    animatable.stop();
                }
                animatable.start();
            }
        }
    }

    /**
     * Returns the checked state.
     *
     * @return The checked state.
     */
    public boolean isChecked() {
        return checked;
    }
}
