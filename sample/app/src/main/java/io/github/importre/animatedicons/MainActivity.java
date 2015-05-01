package io.github.importre.animatedicons;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.TextView;


public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    private AnimatedButton btn1;
    private AnimatedButton btn2;
    private AnimatedButton btn3;
    private TextView text1;
    private TextView text2;
    private TextView text3;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        btn1 = (AnimatedButton) findViewById(R.id.button1);
        btn1.setOnClickListener(this);

        btn2 = (AnimatedButton) findViewById(R.id.button2);
        btn2.setOnClickListener(this);

        btn3 = (AnimatedButton) findViewById(R.id.button3);
        btn3.setOnClickListener(this);

        text1 = (TextView) findViewById(R.id.text1);
        text2 = (TextView) findViewById(R.id.text2);
        text3 = (TextView) findViewById(R.id.text3);

        updateUi();
    }

    private void updateUi() {
        boolean c1 = btn1.isChecked();
        boolean c2 = btn2.isChecked();
        boolean c3 = btn3.isChecked();

        text1.setText(c1 ? R.string.play : R.string.pause);
        text2.setText(c2 ? R.string.expand_less : R.string.expand_more);
        text3.setText(c3 ? R.string.repeat : R.string.repeat_one);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.button1:
                btn1.toggle();
                updateUi();
                break;

            case R.id.button2:
                btn2.toggle();
                updateUi();
                break;

            case R.id.button3:
                btn3.toggle();
                updateUi();
                break;
        }
    }
}
