package zone.cogni.qpilot.ui;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@SpringBootApplication
@Controller
public class Qpilot2UiApplication {

	public static void main(String[] args) {
		SpringApplication.run(Qpilot2UiApplication.class, args);
	}

	@RequestMapping(value = {"/detail/0"})
	protected String redirect() {
		return "redirect:/index.html";
	}

}
